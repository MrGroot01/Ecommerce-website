import { useState, useCallback } from "react";

// 🔥 Backend URL (hardcoded for stability)
const BACKEND = "https://payments-kc7a.onrender.com";

/* ─────────────────────────────────────────────── */
// Load Razorpay SDK
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });

/* ─────────────────────────────────────────────── */
export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);

  /* ─────────────────────────────────────────────── */
  // VERIFY PAYMENT
  const verifyPayment = async (paymentDetails) => {
    try {
      console.log("VERIFY API:", `${BACKEND}/api/payments/verify/`);

      const res = await fetch(`${BACKEND}/api/payments/verify/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentDetails),
      });

      const data = await res.json();

      if (res.ok) {
        setOrderStatus("SUCCESS");
      } else {
        setOrderStatus("FAILED");
        setError(data.error || "Verification failed");
      }
    } catch (err) {
      console.error("Verify error:", err);
      setOrderStatus("FAILED");
      setError("Network error during verification");
    }
  };

  /* ─────────────────────────────────────────────── */
  // MAIN PAYMENT FUNCTION
  const initiatePayment = useCallback(
    async ({
      cartItems,
      deliveryAddress,
      deliveryCharge = 0,
      userName = "",
      userEmail = "",
      userPhone = "",
      onSuccess,
      onFailure,
    }) => {
      setLoading(true);
      setError(null);

      const loaded = await loadRazorpayScript();

      if (!loaded) {
        setError("Failed to load Razorpay SDK");
        setLoading(false);
        return;
      }

      let res;
      let data;

      try {
        const url = `${BACKEND}/api/payments/create-order/`;

        // 🔥 DEBUG (IMPORTANT)
        console.log("CREATE ORDER API:", url);

        // 🔁 Retry logic (Render cold start fix)
        for (let i = 0; i < 2; i++) {
          try {
            res = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                items: cartItems,
                delivery_address: deliveryAddress,
                delivery_charge: deliveryCharge,
              }),
            });

            if (res) break;
          } catch (err) {
            console.log("Retrying request...");
            await new Promise((r) => setTimeout(r, 2000));
          }
        }

        if (!res) {
          throw new Error("Backend not reachable (Render sleeping)");
        }

        const text = await res.text();

        try {
          data = JSON.parse(text);
        } catch {
          console.error("Raw response:", text);
          throw new Error("Server returned invalid response");
        }

        if (!res.ok) {
          throw new Error(data.error || "Order creation failed");
        }

      } catch (err) {
        console.error("Create order error:", err);
        setError(err.message || "Failed to connect to backend");
        setLoading(false);
        return;
      }

      // ✅ Extract data
      const { order_id, razorpay_order_id, amount, currency, key } = data;

      setOrderId(order_id);

      // 🔥 IMPORTANT DEBUG
      console.log("Razorpay Key:", key);

      const options = {
        key,
        amount,
        currency,
        name: "QuickKart",
        description: "Order Payment",
        order_id: razorpay_order_id,

        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },

        theme: {
          color: "#16a34a",
        },

        handler: async (response) => {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (onSuccess) onSuccess(order_id);
          setLoading(false);
        },

        modal: {
          ondismiss: () => {
            setError("Payment cancelled");
            setOrderStatus("FAILED");
            setLoading(false);

            if (onFailure) onFailure("cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        setError(response.error.description || "Payment failed");
        setOrderStatus("FAILED");
        setLoading(false);

        if (onFailure) onFailure(response.error);
      });

      rzp.open();
    },
    []
  );

  return {
    initiatePayment,
    loading,
    error,
    orderStatus,
    orderId,
  };
};
// FILE: src/hooks/useRazorpay.js

import { useState, useCallback } from "react";

const BACKEND = import.meta.env.VITE_API_URL;

/* ─────────────────────────────────────────────── */
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);

  /* ─────────────────────────────────────────────── */
  const pollOrderStatus = useCallback(async (dbOrderId) => {
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;

      try {
        const res = await fetch(`${BACKEND}/api/payments/order/${dbOrderId}/`);
        const data = await res.json();

        if (data.status === "SUCCESS" || data.status === "FAILED") {
          setOrderStatus(data.status);
          clearInterval(interval);
        }
      } catch {}

      if (attempts >= 10) {
        clearInterval(interval);
        setOrderStatus("PENDING");
      }
    }, 3000);
  }, []);

  /* ─────────────────────────────────────────────── */
  const verifyPayment = useCallback(
    async (paymentDetails, dbOrderId) => {
      try {
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
          setError(data.detail || "Verification failed");
        }
      } catch {
        pollOrderStatus(dbOrderId);
      }
    },
    [pollOrderStatus]
  );

  /* ─────────────────────────────────────────────── */
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

      let createData;

      try {
        const res = await fetch(`${BACKEND}/api/payments/create-order/`, {
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

        // 🔥 FIX: handle HTML error safely
        const text = await res.text();
        console.log("BACKEND RESPONSE:", text);

        try {
          createData = JSON.parse(text);
        } catch (e) {
          throw new Error("Backend crashed (check Render logs)");
        }

        if (!res.ok) {
          throw new Error(createData.detail || "Order failed");
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
        return;
      }

      const { order_id, razorpay_order_id, amount, currency, key } = createData;

      setOrderId(order_id);

      const options = {
        key,
        amount,
        currency,
        name: "MyShop",
        description: "Order Payment",
        order_id: razorpay_order_id,

        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },

        theme: {
          color: "#ff6b35",
        },

        handler: async (response) => {
          await verifyPayment(
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            order_id
          );

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
        setError(response.error.description || "Payment failed");
        setOrderStatus("FAILED");
        setLoading(false);

        if (onFailure) onFailure(response.error);
      });

      rzp.open();
    },
    [verifyPayment]
  );

  return {
    initiatePayment,
    loading,
    error,
    orderStatus,
    orderId,
  };
};
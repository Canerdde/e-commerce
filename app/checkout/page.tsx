"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0 && step === "form") {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-foreground-muted mb-4">Your cart is empty</p>
          <Link
            href="/products"
            className="text-accent hover:text-accent-hover transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.zipCode) newErrors.zipCode = "Zip code is required";
    if (!formData.country) newErrors.country = "Country is required";

    if (!formData.cardNumber) newErrors.cardNumber = "Card number is required";
    else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, "")))
      newErrors.cardNumber = "Invalid card number";

    if (!formData.cardName) newErrors.cardName = "Cardholder name is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (!formData.cvv) newErrors.cvv = "CVV is required";
    else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = "Invalid CVV";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      clearCart();
      setStep("success");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (step === "success") {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md space-y-10">
          <div className="w-16 h-16 bg-accent flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-background" />
          </div>
          <div className="space-y-4">
            <h1 className="text-display-3 font-light tracking-[-0.02em]">Order Confirmed</h1>
            <p className="text-base text-foreground-muted leading-relaxed font-light">
              Thank you for your purchase. You will receive a confirmation email shortly.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-block px-10 py-5 bg-accent text-background text-xs font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div>
              <h1 className="text-display-3 font-light tracking-[-0.02em] mb-12">Checkout</h1>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <section>
                  <h2 className="text-base font-medium mb-6 tracking-wider uppercase text-foreground-muted">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium mb-3 tracking-wider uppercase text-foreground-muted">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`w-full px-5 py-4 bg-background-secondary border focus:outline-none focus:border-accent transition-colors duration-200 ${
                          errors.email ? "border-red-500" : "border-foreground/10"
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Shipping Address */}
                <section>
                  <h2 className="text-base font-medium mb-6 tracking-wider uppercase text-foreground-muted">
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-3 tracking-wider uppercase text-foreground-muted">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        className={`w-full px-5 py-4 bg-background-secondary border focus:outline-none focus:border-accent transition-colors duration-200 ${
                          errors.firstName ? "border-red-500" : "border-foreground/10"
                        }`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-3 tracking-wider uppercase text-foreground-muted">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        className={`w-full px-5 py-4 bg-background-secondary border focus:outline-none focus:border-accent transition-colors duration-200 ${
                          errors.lastName ? "border-red-500" : "border-foreground/10"
                        }`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs font-medium mb-3 tracking-wider uppercase text-foreground-muted">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className={`w-full px-5 py-4 bg-background-secondary border focus:outline-none focus:border-accent transition-colors duration-200 ${
                        errors.address ? "border-red-500" : "border-foreground/10"
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-medium mb-3 tracking-wider uppercase text-foreground-muted">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        className={`w-full px-5 py-4 bg-background-secondary border focus:outline-none focus:border-accent transition-colors duration-200 ${
                          errors.city ? "border-red-500" : "border-foreground/10"
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-3 tracking-wider uppercase text-foreground-muted">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleChange("zipCode", e.target.value)}
                        className={`w-full px-5 py-4 bg-background-secondary border focus:outline-none focus:border-accent transition-colors duration-200 ${
                          errors.zipCode ? "border-red-500" : "border-foreground/10"
                        }`}
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-3 tracking-wider uppercase text-foreground-muted">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleChange("country", e.target.value)}
                        className={`w-full px-5 py-4 bg-background-secondary border focus:outline-none focus:border-accent transition-colors duration-200 ${
                          errors.country ? "border-red-500" : "border-foreground/10"
                        }`}
                      />
                      {errors.country && (
                        <p className="mt-1 text-sm text-red-500">{errors.country}</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Payment Information */}
                <section>
                  <h2 className="text-base font-medium mb-6 tracking-wider uppercase text-foreground-muted">
                    Payment Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium mb-3 tracking-wider uppercase text-foreground-muted">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) =>
                          handleChange(
                            "cardNumber",
                            e.target.value.replace(/\s/g, "").slice(0, 16)
                          )
                        }
                        className={`w-full px-5 py-4 bg-background-secondary border focus:outline-none focus:border-accent transition-colors duration-200 ${
                          errors.cardNumber ? "border-red-500" : "border-foreground/10"
                        }`}
                        placeholder="1234 5678 9012 3456"
                        maxLength={16}
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-3 tracking-wider uppercase text-foreground-muted">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={formData.cardName}
                        onChange={(e) => handleChange("cardName", e.target.value)}
                        className={`w-full px-5 py-4 bg-background-secondary border focus:outline-none focus:border-accent transition-colors duration-200 ${
                          errors.cardName ? "border-red-500" : "border-foreground/10"
                        }`}
                      />
                      {errors.cardName && (
                        <p className="mt-1 text-sm text-red-500">{errors.cardName}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-3 tracking-wider uppercase text-foreground-muted">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={formData.expiryDate}
                          onChange={(e) =>
                            handleChange(
                              "expiryDate",
                              e.target.value.replace(/\D/g, "").slice(0, 4)
                            )
                          }
                          className={`w-full px-5 py-4 bg-background-secondary border focus:outline-none focus:border-accent transition-colors duration-200 ${
                            errors.expiryDate ? "border-red-500" : "border-foreground/10"
                          }`}
                          placeholder="MM/YY"
                          maxLength={4}
                        />
                        {errors.expiryDate && (
                          <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-3 tracking-wider uppercase text-foreground-muted">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={formData.cvv}
                          onChange={(e) =>
                            handleChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
                          }
                          className={`w-full px-5 py-4 bg-background-secondary border focus:outline-none focus:border-accent transition-colors duration-200 ${
                            errors.cvv ? "border-red-500" : "border-foreground/10"
                          }`}
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cvv && (
                          <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <button
                  type="submit"
                  className="w-full py-5 bg-accent text-background text-xs font-medium tracking-wider uppercase hover:bg-accent-hover transition-colors duration-200"
                >
                  Complete Order
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 bg-background-secondary p-8">
              <h2 className="text-base font-medium mb-8 tracking-wider uppercase text-foreground-muted">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-background flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-foreground-muted">
                        {item.size} • {item.color} • Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-foreground/5 pt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted tracking-wide uppercase text-xs">Subtotal</span>
                  <span className="tracking-wide">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted tracking-wide uppercase text-xs">Shipping</span>
                  <span className="tracking-wide">Free</span>
                </div>
                <div className="flex justify-between text-lg font-light pt-4 border-t border-foreground/5">
                  <span className="tracking-wider uppercase text-sm">Total</span>
                  <span className="tracking-wide">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


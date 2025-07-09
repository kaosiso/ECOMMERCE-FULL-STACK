import { useState, useContext } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import convertUsdToNaira from "../utils/convertCurrency"; // make sure this is at the top of the file

const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handlePaystackCallback = async (response, orderItems, amountNGN) => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        toast.error("User not found. Please log in again.");
        return;
      }

      const user = JSON.parse(userString);
      console.log("Decoded user object from localStorage:", user);

      if (!user?._id) {
        toast.error("Invalid user data. Please log in again.");
        return;
      }

      const paystackData = {
        reference: response.reference,
        address: formData,
        items: orderItems,
        amount: amountNGN,
        userId: user._id,
      };

      console.log("Sending Paystack order to backend:", paystackData);

      const res = await axios.post(
        `${backendUrl}/api/order/paystack`,
        paystackData,
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Order placed successfully!");
        setCartItems({});
        navigate("/orders");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Paystack verification error:", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Payment verification failed"
      );
    }
  };
  

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let orderItems = [];
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            const product = structuredClone(
              products.find((p) => p._id === productId)
            );
            if (product) {
              product.size = size;
              product.quantity = cartItems[productId][size];
              orderItems.push(product);
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      console.log("Placing order with data:", orderData);

      switch (method) {
        case "cod": {
          const res = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            {
              headers: { token },
            }
          );
          if (res.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(res.data.message);
          }
          break;
        }

        case "stripe": {
          const res = await axios.post(
            `${backendUrl}/api/order/stripe`,
            orderData,
            {
              headers: { token },
            }
          );
          if (res.data.success) {
            window.location.replace(res.data.session_url);
          } else {
            toast.error(res.data.message);
          }
          break;
        }

        case "paystack": {
          const ref = "PS_" + Math.floor(Math.random() * 1000000000);
          if (!window.PaystackPop || !paystackKey) {
            toast.error("Paystack setup error.");
            return;
          }

          try {
            const cartUSD = getCartAmount();
            const deliveryUSD = delivery_fee;

            const amountNGN = await convertUsdToNaira(cartUSD, deliveryUSD);

            console.log("Converted Amount (NGN):", amountNGN);

            if (!amountNGN || isNaN(amountNGN)) {
              toast.error("Amount not set correctly.");
              return;
            }

            const handler = window.PaystackPop.setup({
              key: paystackKey,
              email: formData.email,
              amount: amountNGN * 100, // Paystack expects amount in kobo
              currency: "NGN",
              ref,
              callback: function (response) {
                console.log("Paystack callback response:", response);
                handlePaystackCallback(response, orderItems, amountNGN);
              },
              onClose: function () {
                toast.warn("Payment was cancelled");
              },
            });

            handler.openIframe();
          } catch (error) {
            console.error("Paystack setup error:", error);
            toast.error("Currency conversion failed. Please try again.");
          }

          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* Delivery Info */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            name="firstName"
            onChange={onChangeHandler}
            value={formData.firstName}
            required
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            name="lastName"
            onChange={onChangeHandler}
            value={formData.lastName}
            required
            placeholder="Last name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          name="email"
          onChange={onChangeHandler}
          value={formData.email}
          required
          placeholder="Email address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <input
          name="street"
          onChange={onChangeHandler}
          value={formData.street}
          required
          placeholder="Street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <div className="flex gap-3">
          <input
            name="city"
            onChange={onChangeHandler}
            value={formData.city}
            required
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            name="state"
            onChange={onChangeHandler}
            value={formData.state}
            required
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex gap-3">
          <input
            name="zipcode"
            onChange={onChangeHandler}
            value={formData.zipcode}
            required
            placeholder="Zipcode"
            type="number"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            name="country"
            onChange={onChangeHandler}
            value={formData.country}
            required
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          name="phone"
          onChange={onChangeHandler}
          value={formData.phone}
          required
          placeholder="Phone"
          type="number"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
      </div>

      {/* Payment */}
      <div className="mt-8">
        <div className="min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              />
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="stripe" />
            </div>
            <div
              onClick={() => setMethod("paystack")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "paystack" ? "bg-green-400" : ""
                }`}
              />
              <img
                className="h-5 mx-4"
                src={assets.paystack_logo}
                alt="paystack"
              />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              />
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

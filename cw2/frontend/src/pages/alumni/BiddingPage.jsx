import { useState, useContext } from "react";
import { BidContext } from "../../context/BidContext";
import { useBid } from "../../hooks/useBid";
import {
  TrendingUp,
  BadgeDollarSign,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function BiddingPage() {
  // const { myBid, placeBid, loadingBid, fetchMyBid } = useContext(BidContext);
  const { myBid, placeBid, loadingBid, fetchMyBid } = useBid();

  const [amount, setAmount] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBid = async () => {
    setLoading(true);
    setFeedback("");

    try {
      const res = await placeBid(Number(amount));

      // extract wins (e.g. "2/4")
      const [used, total] = res.monthlyWins
        ? res.monthlyWins.split("/")
        : [null, null];

      let message = "";

      if (res.status === "Currently Leading") {
        message = `You're currently leading with a bid of £${res.currentBid}.`;
      } else {
        message = `Your bid of $${res.currentBid} was placed, but you're currently outbid.`;
      }

      // add monthly context
      if (used && total) {
        message += ` You've used ${used} out of ${total} wins this month.`;
      }

      setFeedback(message);

      setAmount("");
      fetchMyBid();
    } catch (err) {
      setFeedback(err?.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2EF] pb-12 font-sans">
      <div className="max-w-5xl mx-auto pt-6 px-4 space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center gap-3">
          <TrendingUp className="text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">
            Alumni Bidding
          </h1>
        </div>

        {/* BID INPUT */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">

          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <BadgeDollarSign size={18} />
            Place your bid for today
          </div>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount (e.g. $100)"
          />

          <button
            onClick={handleBid}
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Bid"}
          </button>

          {/* FEEDBACK (WITH MONTHLY WINS) */}
          {feedback && (
            <div className="flex items-start gap-2 text-sm mt-2">
              {feedback.includes("leading") ? (
                <Sparkles className="text-green-600 mt-0.5" size={16} />
              ) : (
                <AlertCircle className="text-orange-500 mt-0.5" size={16} />
              )}
              <p className="text-gray-700 leading-relaxed">{feedback}</p>
            </div>
          )}
        </div>

        {/* MY BID */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">

          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <TrendingUp size={18} />
            My Bid
          </div>

          {loadingBid ? (
            <p className="text-gray-500 mt-2">Loading your bid...</p>
          ) : myBid ? (
            <div className="mt-3 space-y-1">
              <p className="text-lg font-semibold text-gray-900">
                ${myBid.amount}
              </p>

              <p
                className={
                  myBid.liveStatus === "Currently Leading"
                    ? "text-green-600 text-sm"
                    : "text-orange-500 text-sm"
                }
              >
                {myBid.liveStatus === "Currently Leading"
                  ? "You are currently leading today's bidding."
                  : "You have been outbid. Try increasing your amount."}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 mt-2">
              You haven’t placed a bid today yet.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
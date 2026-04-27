import { useEffect, useState } from "react";
import { placeBid, getMyBid } from "../../api/bidService";
import { Gavel, TrendingUp } from "lucide-react";

export default function BiddingPage() {
  const [amount, setAmount] = useState("");
  const [myBid, setMyBid] = useState(null);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const loadMyBid = async () => {
    try {
      const res = await getMyBid();
      setMyBid(res.data);
    } catch {
      setMyBid(null);
    }
  };

  useEffect(() => {
    loadMyBid();
  }, []);

  const handleBid = async () => {
    setLoading(true);
    setMsg("");
    setStatus("");

    try {
      const res = await placeBid({ amount: Number(amount) });
      setMsg(res.data.msg);
      setStatus(res.data.status);
      loadMyBid();
      setAmount("");
    } catch (err) {
      setMsg(err?.response?.data?.msg || "Error placing bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div className="bg-white p-6 rounded-xl border">
        <div className="flex items-center gap-2 text-blue-600 font-semibold">
          <Gavel size={20} />
          Alumni Bidding
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border space-y-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-3 rounded-lg"
          placeholder="Enter bid amount"
        />

        <button
          onClick={handleBid}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          {loading ? "Submitting..." : "Submit Bid"}
        </button>

        {msg && <p className="text-sm">{msg}</p>}

        {status && (
          <p className={status === "Winning" ? "text-green-600" : "text-orange-500"}>
            Status: {status}
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <div className="flex items-center gap-2 font-semibold">
          <TrendingUp size={18} />
          My Bid
        </div>

        {myBid ? (
          <p className="mt-2">
            £{myBid.amount} - {myBid.liveStatus}
          </p>
        ) : (
          <p className="text-gray-500">No bid today</p>
        )}
      </div>

    </div>
  );
}
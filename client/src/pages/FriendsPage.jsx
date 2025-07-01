import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { UsersIcon, ArrowLeftIcon } from "lucide-react";

const FriendsPage = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="container mx-auto space-y-10 bg-base-100 min-h-screen px-4 py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Friends</h1>
          <p className="opacity-70 text-sm">
            Here are the people you're connected with. Start chatting and learning!
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/" className="btn btn-outline btn-sm">
            <ArrowLeftIcon className="mr-2 size-4" />
            Back to Home
          </Link>
          <Link to="/notifications" className="btn btn-primary btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : friends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {friends.map((friend) => (
            <FriendCard key={friend._id} friend={friend} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;

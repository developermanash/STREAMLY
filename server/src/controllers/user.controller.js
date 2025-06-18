import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";


export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;
        const recommendedUsers = await user.find({
            $and: [
                { _id: { $ne: currentUserId } },//exclude current user
                { $id: { $nin: currentUser.friends } },//exclude current user friends
                { isOnboarded: true }
            ],
        })
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in the recommendUser controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}



export async function getMyFriends(req, res) {
    try {
        friends
        const user = await User.findById(req.user.id).select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends conntroller", error.message);
        res.status(500).json({ message: "internal server error" });
    }
}


export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: recipentId } = req.params;

        //Prevent sending req to yourself
        if (myId === recipentId) {
            return res.status(400).json({ message: "you cant send friend request to yourself" });
        }

        const recipent = await User.findById(recipentId)
        if (!recipentId) {
            return res.status(400).json({ message: "Recipent not found" });
        }

        //check if user is already friends 

        if (recipent.friends.includes(myId)) {
            return res.status(400).json({ message: "you are already friends with this user" });
        }

        //check if a request is already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipentId },
                { sender: recipentId, recipient: myId },
            ],
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists" })
        };

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipent: recipentId,
        });
        res.status(2001).json({ friendRequest });
    } catch (error) {
        console.log("Error in the friend request controller", error.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}




export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}



export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
import { User } from "../models/user.model.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Post } from "../models/post.model.js";
import dotenv from "dotenv";
dotenv.config();
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🚀 ~ login ~  req.body:", req.body)
        if (!email || !password) {
            return res.status(400).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        console.log("🚀 ~ login ~ user:", user)
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log("🚀 ~ login ~ isPasswordMatch:", isPasswordMatch)
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect  password",
                success: false,
            });
        };

        const token = await jwt.sign({ userId: user._id }, "eruighueiy", { expiresIn: '1d' });

        // populate each post if in the posts array
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        }
        // return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
        //     message: `Welcome back ${user.username}`,
        //     success: true,

        //     user
        // });
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: true, maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true, token: token,

            user
        });

    } catch (error) {
        console.log(error);
    }
};
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("🚀 ~ getProfile ~ userId:", userId)
        let user = await User.findById(userId).populate({ path: 'posts', createdAt: -1 }).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

// export const editProfile = async (req, res) => {
//     try {
//         const userId = req.id;
//         console.log("🚀 ~ editProfile ~ req.id:", req.id)
//         const { bio, gender } = req.body;
//         console.log("🚀 ~ editProfile ~ req.body:", req.body)
//         const image = req.file;
//         console.log("🚀 ~ editProfile ~  req.file:", req.file)
//         let cloudResponse;
//         const optimizedImageBuffer = await sharp(image.buffer)
//             .resize({ width: 800, height: 800, fit: 'inside' })
//             .toFormat('jpeg', { quality: 80 })
//             .toBuffer();

//         // buffer to data uri
//         const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
//         if (image) {
//             // const fileUri = getDataUri(profilePicture);
//             cloudResponse = await cloudinary.uploader.upload(fileUri);
//         }

//         const user = await User.findById(userId).select('-password');
//         if (!user) {
//             return res.status(404).json({
//                 message: 'User not found.',
//                 success: false
//             });
//         };
//         if (bio) user.bio = bio;
//         if (gender) user.gender = gender;
//         if (image) user.profilePicture = cloudResponse.secure_url;

//         await user.save();

//         return res.status(200).json({
//             message: 'Profile updated.',
//             success: true,
//             user
//         });

//     } catch (error) {
//         console.log(error);
//     }
// };
export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        console.log("🚀 ~ editProfile ~ req.id:", req.id)
        const { bio, gender } = req.body;
        console.log("🚀 ~ editProfile ~ req.body:", req.body)
        const image = req.file;
        console.log("🚀 ~ editProfile ~  req.file:", req.file)
        let cloudResponse;

        if (image) {
            const optimizedImageBuffer = await sharp(image.buffer)
                .resize({ width: 800, height: 800, fit: 'inside' })
                .toFormat('jpeg', { quality: 80 })
                .toBuffer();

            // buffer to data uri
            const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (image) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false
        });
    }
};

export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id; // patel
        console.log("🚀 ~ followOrUnfollow ~ followKrneWala:", followKrneWala)
        const jiskoFollowKrunga = req.params.id; // shivani
        console.log("🚀 ~ followOrUnfollow ~ jiskoFollowKrunga:", jiskoFollowKrunga)
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        console.log("🚀 ~ followOrUnfollow ~ user:", user)
        const targetUser = await User.findById(jiskoFollowKrunga);
        console.log("🚀 ~ followOrUnfollow ~ targetUser:", targetUser)

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        console.log("🚀 ~ followOrUnfollow ~ isFollowing:", isFollowing)
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}

export const follow = async (req, res) => {
    try {
        const followUser = await User.findByIdAndUpdate(req.params.id, {
            $push: { followers: req.id }
        }, {
            new: true
        })
        if (!followUser) {
            return res.status(422).json({ error: "User to follow not found" })
        }
        const UpdateUser = await User.findByIdAndUpdate(
            req.id,
            { $push: { following: req.params.id } },
            { new: true }
        );
        console.log("🚀 ~ router.post ~ followUser:", followUser)
        if (!UpdateUser) {
            return res.status(404).json({ error: "Current user not found" });
        } else {
            res.json({ message: "Followed successfully", UpdateUser });
        }
    } catch (err) {
        console.log(err)
    }
}

export const unfollow = async (req,res)=>{
    try{
        const followUser = await User.findByIdAndUpdate(req.params.id,{
        $pull:{followers:req.id}
      },{
        new:true
      })
      if(!followUser){
        return res.status(422).json({error:"User to follow not found"})
      }
      const UpdateUser = await User.findByIdAndUpdate(
        req.id, 
        { $pull: { following: req.params.id } },
        { new: true }
      );
      if (!UpdateUser) {
        return res.status(404).json({ error: "Current user not found" });
      } else{
        res.json({ message: "UnFollowed successfully", UpdateUser });
      }
    }catch(err){
      console.log(err)
    }
  }

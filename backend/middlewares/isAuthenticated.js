import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
    
        try {
            const token = req.cookies.token || req.headers['Authorization']?.split(' ')[1];
            console.log("🚀 ~ isAuthenticated ~ req.headers:", req.headers)
            console.log("🚀 ~ isAuthenticated ~ req.headers['Authorization']?.split(' ')[1]:", req.headers['Authorization']?.split(' ')[1])
            console.log("🚀 ~ isAuthenticated ~ token:", token)
            if (!token) {
                return res.status(401).json({ message: 'User not authenticated', success: false });
            }
            const decode = await jwt.verify(token, "eruighueiy");
            if (!decode) {
                return res.status(401).json({ message: 'Invalid token', success: false });
            }
            req.id = decode.userId;
            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error', success: false });
        }
    
}

export default isAuthenticated;
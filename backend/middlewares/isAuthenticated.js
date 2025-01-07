import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
    try {
        console.log('Request headers:', req.headers.cookie);  // Shows raw cookies
        console.log('Parsed cookies:', req.cookies);          // Parsed cookies
        const token = req.cookies.token;
        console.log('Token:', token);                         // Should show token

        if (!token) {
            return res.status(401).json({
                message: 'User not authenticated',
                success: false
            });
        }
        const decode = await jwt.verify(token, "eruighueiy");
        if (!decode) {
            return res.status(401).json({
                message: 'Invalid',
                success: false
            });
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
    }
}
export default isAuthenticated;
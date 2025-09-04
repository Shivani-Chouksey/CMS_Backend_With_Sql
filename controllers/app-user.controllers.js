export const CreateAppUser = (req, res) => {
    try {
        console.log('CreateAppUser', req.files);
        return res.send('CreateAppUser')
    } catch (error) {
        console.log('CreateAppUser error -->', error);
        return res.status(500).json({ Success: true, message: "Internal Server ", error: error })
    }
}
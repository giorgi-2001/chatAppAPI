const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const uploadImage = async (string, name) => {

    const avatar = await cloudinary.uploader.upload(string, {
        folder: 'avatars',
        public_id: name
    }, (err, res) => {
        if(err) {
            console.log(err)
        }
    })
    return avatar
}

module.exports = uploadImage
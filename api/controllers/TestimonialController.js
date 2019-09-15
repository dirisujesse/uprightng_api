/**
 * TestimonialController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    createTestimonial: function (req, res) {
        var data = req.body;
        var isVideo = data.mediaType;
        var Service = isVideo === "video"
            ? S3Service.uploadVideo(data.media || '', `${data.title}_${new Date().valueOf()}`)
            : isVideo === 'audio'
                ? S3Service.uploadAudio(data.media || '', `${data.title}_${new Date().valueOf()}`)
                : S3Service.upload(data.media || '', `${data.title}_${new Date().valueOf()}`);
        Service
            .then(function (url) {
                var testimonial_ = Object.assign(data, { media: url })
                Testimonial.create(testimonial_)
                    .exec(function (err, testimonial) {
                        if (err) {
                            return res.negotiate(err);
                        }
                        if (!testimonial) {
                            return res.notFound();
                        }
                        if (testimonial) {
                            return res.json(testimonial);
                        }
                    });
            }).catch(function (err) {
                return res.badRequest();
            })
    },
};


import marked from 'marked';

export default class Message {
  constructor(node) {
    Object.assign(this, node);
  }

  get coverImage() {
    return ({ sources: [{ uri: this.images.square.url }] });
  }

  get htmlContent() {
    const { description, sermon_guide, transcript } = this;
    let htmlContent = `<p>${description}</p>`;

      if (sermon_guide && sermon_guide.markdown) {
        htmlContent += marked(sermon_guide.markdown);
      }

      if (transcript && transcript.markdown) {
        htmlContent += marked(transcript.markdown);
      }

      return htmlContent;
  }

  get summary() {
    return this.subtitle;
  }


  get images() {
    const { images } = this;
    return Object.keys(images).map((key) => ({ uri: images[key].url, name: images[key].type_name, key }));
  }

  get videos() {
    const { assets: { streaming_video } = {} } = this;
    return streaming_video.url ? [{ sources: [{ uri: streaming_video.url }], name: streaming_video.type_name, key: 'streaming_video' }] : null;
  }

  get audios() {
    const { assets: { audio } = {} } = this;
    return audio.url ? [{ sources: [{ uri: audio.url }], name: audio.type_name, key: 'audio' }] : null;
  }

  get theme() {
    return null; // TODO
  }
}
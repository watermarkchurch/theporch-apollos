import { Features as baseFeatures } from '@apollosproject/data-connector-rock';
import { createGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';

class WCCFeatures extends baseFeatures.dataSource {

  // eslint-disable-next-line class-methods-use-this
  getFeatures(root) {
    const speakerFeatures = root.speakers.map(this.createSpeakerFeature)

    return [...speakerFeatures]
  }

  createSpeakerFeature({ name, id }) {
    console.log(name, id);
    return {
      name,
      id: createGlobalId(id, 'SpeakerFeature'),
      __typename: 'SpeakerFeature',
    };
  }
}

const resolver = {
  SpeakerFeature: {
    profileImage: async ({ name }, args, { dataSources }) => {
      const speaker = await dataSources.WCCMessage.getSpeakerByName({ name })
      if (speaker?.image) {
        return { sources: [{ uri: speaker.image }]}
      }
      return null
    }
  }
}

const schema = gql`
  type SpeakerFeature implements Feature & Node {
    id: ID!
    order: Int

    name: String
    profileImage: ImageMedia
  }
`;

export {
  WCCFeatures as dataSource,
  schema,
  resolver,
}
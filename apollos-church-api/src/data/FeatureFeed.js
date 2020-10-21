import { FeatureFeed } from '@apollosproject/data-connector-rock';
import { createGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';

const resolver = {
  ...FeatureFeed.resolver,
  Query: {
    ...FeatureFeed.resolver.Query,
    homeFeedFeaturesWithCampus: (root, { campusId }, context) => {
      context.campusId = campusId;
      return context.dataSources.FeatureFeed.getFeed({
        type: 'apollosConfig',
        args: { section: 'HOME_FEATURES', campusId },
      });
    },
  },
  FeatureFeed: {
    ...FeatureFeed.resolver.FeatureFeed,
    // lazy-loaded
    id: ({ id }) => createGlobalId(id, 'FeatureFeed'),
    features: ({ getFeatures }) => getFeatures(),
  },
};

class dataSource extends FeatureFeed.dataSource {
  getFeed = async ({ type = '', args = {} }) => {
    let getFeatures = () => [];
    const { Feature, ContentItem } = this.context.dataSources;

    if (type === 'apollosConfig') {
      if (args.campusId) {
        this.context.campusId = args.campusId; // Change from core, setting campusId. Need to rethink best way to do this.
      }
      getFeatures = () =>
        Feature.getFeatures(ApollosConfig[args.section] || []);
    }

    if (type === 'contentItem' && args.id) {
      const contentItem = await ContentItem.getFromId(args.id);
      getFeatures = () => ContentItem.getFeatures(contentItem);
    }

    return {
      __typename: 'FeatureFeed',
      id: JSON.stringify({ type, args }), // changed from core, no global id here.
      getFeatures,
    };
  };
}

export { resolver, dataSource };

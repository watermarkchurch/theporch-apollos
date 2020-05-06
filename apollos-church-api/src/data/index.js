import { gql } from 'apollo-server';

import { createApolloServerConfig } from '@apollosproject/server-core';

import * as Analytics from '@apollosproject/data-connector-analytics';
import * as Scripture from '@apollosproject/data-connector-bible';
// import * as Cloudinary from '@apollosproject/data-connector-cloudinary';
import * as OneSignal from '@apollosproject/data-connector-onesignal';
import * as Pass from '@apollosproject/data-connector-passes';
import * as Cache from '@apollosproject/data-connector-redis-cache';
import * as Sms from '@apollosproject/data-connector-twilio';
import {
  // Followings,
  Interactions,
  RockConstants,
  Person,
  // ContentItem,
  // ContentChannel,
  Sharable,
  Auth,
  PersonalDevice,
  Template,
  AuthSms,
  Group,
  BinaryFiles,
  // Feature,
} from '@apollosproject/data-connector-rock';
import * as Theme from './theme';
import * as ContentfulData from './contentful';

import * as WCCMessage from './wcc-media';
import * as WCCSeries from './wcc-series';
import * as WCCBlog from './wcc-blog';
import * as Feature from './wcc-features';
import * as ContentItem from './ContentItem';
import * as ContentChannel from './ContentChannel';
import * as Search from './search';
import * as LiveStream from './livestream';
import * as WCCSpeaker from './WCCSpeaker';
import * as Campus from './Campus';

// This module is used to attach Rock User updating to the OneSignal module.
// This module includes a Resolver that overides a resolver defined in `OneSignal`
import * as OneSignalWithRock from './oneSignalWithRock';

const data = {
  // Followings,
  ContentChannel,
  ContentItem,
  ...ContentfulData,
  Person,
  // Cloudinary,
  Auth,
  AuthSms,
  Sms,
  LiveStream,
  Theme,
  Scripture,
  Interactions,
  RockConstants,
  Sharable,
  Analytics,
  OneSignal,
  PersonalDevice,
  OneSignalWithRock,
  Pass,
  Search,
  Template,
  Campus,
  Group,
  BinaryFiles,
  // WCCFeatures,
  // Event,
  Feature,
  Cache,
  WCCMessage,
  WCCBlog,
  WCCSeries,
  WCCSpeaker,
};

const {
  dataSources,
  resolvers,
  schema,
  context,
  applyServerMiddleware,
  setupJobs,
} = createApolloServerConfig(data);

export {
  dataSources,
  resolvers,
  schema,
  context,
  applyServerMiddleware,
  setupJobs,
};

// the upload Scalar is added
export const testSchema = [
  gql`
    scalar Upload
  `,
  ...schema,
];

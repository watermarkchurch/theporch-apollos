import gql from 'graphql-tag';
import { camelCase, upperFirst } from 'lodash';
import natural from 'natural';
import sanitizeHtmlNode from 'sanitize-html';
import marked from 'marked';
import withCloudinary from '@apollosproject/data-connector-cloudinary/lib/cloudinary';
import { ContentItem } from '@apollosproject/data-connector-rock';
import { contentItemSchema } from '@apollosproject/data-schema'

import ContentfulDataSource from './ContentfulDataSource';

const enforceProtocol = (uri) => (uri.startsWith('//') ? `https:${uri}` : uri);

export class dataSource extends ContentfulDataSource {
  getByType = (type) =>
    this.get(`entries`, {
      content_type: type,
    });

  createSummary = ({ fields: { description: content, summary } }) => {
    if (summary) return summary;
    if (!content || typeof content !== 'string') return '';
    // Protect against 0 length sentences (tokenizer will throw an error)
    if (content.split(' ').length === 1) return '';

    const raw = sanitizeHtmlNode(marked(content), {
      allowedTags: [],
      allowedAttributes: [],
    });

    const tokenizer = new natural.SentenceTokenizer();
    const firstSentence = tokenizer.tokenize(raw)[0];
    return firstSentence;
  };

  createImageField = (field) => {
    return field?.fields?.file?.url ? ({ sources: [{ uri: field.fields.file.url }]}) : null;
  }
}

export const schema = gql`
  type ContentfulAsset implements Media {
    name: String
    description: String
    key: String
    sources: [ContentfulMediaSource]
  }

  type ContentfulMediaSource implements MediaSource {
    uri: String
    contentType: String
  }
`;

export const resolver = {
  ContentfulAsset: {
    name: ({ fields }) => fields.name,
    description: ({ fields }) => fields.description,
    key: ({ fields }) => fields.name,
    sources: ({ fields }) => [fields.file],
  },
  ContentfulMediaSource: {
    uri: ({ url }) => enforceProtocol(url),
  },
};

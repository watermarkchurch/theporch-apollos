import React from 'react';
import gql from 'graphql-tag';
import { DefaultCard } from '@apollosproject/ui-kit';
import { Query } from 'react-apollo';
import moment from 'moment';

const GET_CONFERENCE = gql`
query getConference {
  conference {
    title
    id
    days {
      id
      date
    }
  }
}
`;


const createSummary = ({ conference }) => {
  if (!conference) {
    return null;
  }

  const firstDay = conference.days[0];
  const lastDay = conference.days[conference.days.length - 1];
  return `${moment(firstDay.date).format('MMM D')} - ${moment(lastDay.date).format('MMM D')}`
}

const ConferenceCard = () => {
  return (
    <Query query={GET_CONFERENCE}>
      {({ data, loading }) => (
        <DefaultCard title={data?.conference?.title} summary={createSummary(data)} loading={loading} />
        )}
    </Query>
    )
}

export default ConferenceCard;
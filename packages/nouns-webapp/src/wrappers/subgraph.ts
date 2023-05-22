import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { BigNumberish } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

export interface IBid {
  id: string;
  bidder: {
    id: string;
  };
  amount: BigNumber;
  blockNumber: number;
  blockTimestamp: number;
  txIndex?: number;
  noun: {
    id: number;
    startTime?: BigNumberish;
    endTime?: BigNumberish;
    settled?: boolean;
  };
}

interface ProposalVote {
  supportDetailed: 0 | 1 | 2;
  voter: {
    id: string;
  };
}

export interface ProposalVotes {
  votes: ProposalVote[];
}

export interface Delegate {
  id: string;
  nounsRepresented: {
    id: string;
  }[];
}

export interface Delegates {
  delegates: Delegate[];
}

export const seedsQuery = (first = 1_000) => gql`
{
  seeds(first: ${first}) {
    id
    background
    body
    accessory
    head
    glasses
  }
}
`;

export const proposalQuery = (id: string | number) => gql`
{
  proposal(id: ${id}) {
    id
    description
    status
    proposalThreshold
    quorumVotes
    forVotes
    againstVotes
    abstainVotes
    createdTransactionHash
    createdBlock
    startBlock
    endBlock
    updatePeriodEndBlock
    objectionPeriodEndBlock
    executionETA
    targets
    values
    signatures
    calldatas
    proposer {
      id
    }
  }
}
`;

export const partialProposalsQuery = (first = 1_000) => gql`
{
  proposals(first: ${first}, orderBy: createdBlock, orderDirection: asc) {
    id
    title
    status
    forVotes
    againstVotes
    abstainVotes
    quorumVotes
    executionETA
    startBlock
    endBlock
    updatePeriodEndBlock
    objectionPeriodEndBlock
  }
}
`;

export const candidateProposalsQuery = (first = 1_000) => gql`
  {
    proposalCandidates {
      id
      slug
      proposer
      lastUpdatedTimestamp
      canceled
      createdTransactionHash
      latestVersion {
        title
        versionSignatures {
          signer {
            id
          }
        }
      }
    }
  }
`;

export const candidateProposalQuery = (id: string) => gql`
{
  proposalCandidate(id: "${id}") {
    id
    slug
    proposer
    lastUpdatedTimestamp
    createdTransactionHash
    canceled
    versions {
      title
    }
    latestVersion {
      title
      description
      targets
      values
      signatures
      calldatas
      encodedProposalHash
      versionSignatures {
        id
        signer {
          id
          proposals {
            id
          }
        }
        sig
        expirationTimestamp
        canceled
        reason
      }
    }
  }
}
`;

export const candidateProposalVersionsQuery = (id: string) => gql`
{
  proposalCandidate(id: "${id}") {
    id
    slug
    proposer
    lastUpdatedTimestamp
    canceled
    createdTransactionHash
    versions {
      id
      title
      description
      targets
      values
      signatures
      calldatas
      encodedProposalHash
      createdTimestamp
      updateMessage
    }
    latestVersion {
      id
    }
  }
}
`;

export const proposalVersionsQuery = (id: string | number) => gql`
  {
    proposalVersions(where: { proposal_: { id: "${id}" } }) {
      id
      createdAt
      updateMessage
      title
      description
      targets
      values
      signatures
      calldatas
      proposal {
        id
      }
    }
  }
`;

export const auctionQuery = (auctionId: number) => gql`
{
	auction(id: ${auctionId}) {
	  id
	  amount
	  settled
	  bidder {
	  	id
	  }
	  startTime
	  endTime
	  noun {
		id
		seed {
		  id
		  background
		  body
		  accessory
		  head
		  glasses
		}
		owner {
		  id
		}
	  }
	  bids {
		id
		blockNumber
		txIndex
		amount
	  }
	}
}
`;

export const bidsByAuctionQuery = (auctionId: string) => gql`
 {
	bids(where:{auction: "${auctionId}"}) {
	  id
	  amount
	  blockNumber
	  blockTimestamp
	  txIndex
	  bidder {
	  	id
	  }
	  noun {
		id
	  }
	}
  }
 `;

export const nounQuery = (id: string) => gql`
 {
	noun(id:"${id}") {
	  id
	  seed {
	  background
		body
		accessory
		head
		glasses
	}
	  owner {
		id
	  }
	}
  }
 `;

export const nounsIndex = () => gql`
  {
    nouns {
      id
      owner {
        id
      }
    }
  }
`;

export const latestAuctionsQuery = () => gql`
  {
    auctions(orderBy: startTime, orderDirection: desc, first: 1000) {
      id
      amount
      settled
      bidder {
        id
      }
      startTime
      endTime
      noun {
        id
        owner {
          id
        }
      }
      bids {
        id
        amount
        blockNumber
        blockTimestamp
        txIndex
        bidder {
          id
        }
      }
    }
  }
`;

export const latestBidsQuery = (first: number = 10) => gql`
{
	bids(
	  first: ${first},
	  orderBy:blockTimestamp,
	  orderDirection: desc
	) {
	  id
	  bidder {
		id
	  }
	  amount
	  blockTimestamp
	  txIndex
	  blockNumber
	  auction {
		id
		startTime
		endTime
		settled
	  }
	}
  }  
`;

export const nounVotingHistoryQuery = (nounId: number, first = 1_000) => gql`
{
	noun(id: ${nounId}) {
		id
		votes(first: ${first}) {
      blockNumber
      proposal {
        id
      }
      support
      supportDetailed
      voter {
        id
      }
		}
	}
}
`;

export const nounTransferHistoryQuery = (nounId: number, first = 1_000) => gql`
{
  transferEvents(where: {noun: "${nounId}"}, first: ${first}) {
    id
    previousHolder {
      id
    }
    newHolder {
      id
    }
    blockNumber
  }
}
`;

export const nounDelegationHistoryQuery = (nounId: number, first = 1_000) => gql`
{
  delegationEvents(where: {noun: "${nounId}"}, first: ${first}) {
    id
    previousDelegate {
      id
    }
    newDelegate {
      id
    }
    blockNumber
  }
}
`;

export const createTimestampAllProposals = () => gql`
  {
    proposals(orderBy: createdTimestamp, orderDirection: asc, first: 1000) {
      id
      createdTimestamp
    }
  }
`;

export const proposalVotesQuery = (proposalId: string) => gql`
  {
    votes(where: { proposal: "${proposalId}", votesRaw_gt: 0 }) {
      supportDetailed
      voter {
        id
      }

    }	
  }
`;

export const delegateNounsAtBlockQuery = (delegates: string[], block: number) => gql`
{
  delegates(where: { id_in: ${JSON.stringify(delegates)} }, block: { number: ${block} }) {
    id
    nounsRepresented {
      id
    }
  }
}
`;

export const currentlyDelegatedNouns = (delegate: string) => gql`
{
  delegates(where: { id: "${delegate}"} ) {
    id
    nounsRepresented {
      id
    }
  }
}
`;

export const totalNounSupplyAtPropSnapshot = (proposalId: string) => gql`
{
  proposals(where: {id: ${proposalId}}) {
    totalSupply
  }
}
`;

export const propUsingDynamicQuorum = (propoaslId: string) => gql`
{
  proposal(id: "${propoaslId}") {
    quorumCoefficient 
  }
}
`;

export const clientFactory = (uri: string) =>
  new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });

export const proposalFeedbacksQuery = (proposalId: string) => gql`
{
  proposalFeedbacks(where: {proposal_:{id: "${proposalId}"}}) {
    supportDetailed
    votes
    reason
    createdTimestamp
    voter {
      id
    }
    proposal {
      id
    }
  }
}
`;

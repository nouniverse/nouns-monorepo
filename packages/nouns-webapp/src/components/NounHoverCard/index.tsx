import { useQuery } from "@apollo/client";
import { BigNumber } from "@ethersproject/bignumber";
import { Trans } from "@lingui/macro";
import React from "react";
import { Spinner } from "react-bootstrap";
import { nounQuery } from "../../wrappers/subgraph";
import ShortAddress from "../ShortAddress";
import { StandaloneNounCircular } from "../StandaloneNoun";
import classes from "./NounHoverCard.module.css";
import { HeartIcon, CakeIcon } from "@heroicons/react/solid";
import { isNounderNoun } from "../../utils/nounderNoun";
import { AuctionState } from "../../state/slices/auction";
import { useAppSelector } from "../../hooks";
import { i18n } from "@lingui/core";

interface NounHoverCardProps {
    nounId: string;
}

const NounHoverCard: React.FC<NounHoverCardProps> = props => {

    const {nounId} = props;

    const { loading, error, data } = useQuery(nounQuery(  nounId  ), {
        skip: nounId === null 
    });

  const pastAuctions = useAppSelector(state => state.pastAuctions.pastAuctions);
  if (!pastAuctions || !pastAuctions.length) {
    return <></>;
  }

  if (loading || !data || !nounId) {
    return (
        <div className={classes.spinnerWrapper}>
            <div className={classes.spinner}>
                <Spinner animation="border" />
            </div>
        </div>
      );
    }
    const numericNounId = parseInt(nounId);
    const nounIdForQuery = isNounderNoun(BigNumber.from(nounId)) ? numericNounId + 1 : numericNounId;

  const startTime = BigNumber.from(
    pastAuctions.find((auction: AuctionState, i: number) => {
      const maybeNounId = auction.activeAuction?.nounId;
      return maybeNounId ? BigNumber.from(maybeNounId).eq(BigNumber.from(nounIdForQuery)) : false;
    })?.activeAuction?.startTime || 0,
  );

  if (!startTime) {
    return <Trans>Error fetching Noun birthday</Trans>;
  }

  const birthday = new Date(Number(startTime._hex) * 1000);


    if (error) {
        return <>Failed to fetch</>;
    }

    return (
        <div className={classes.wrapper}>

            {/* First Row */}
            <div className={classes.titleWrapper}>
                <div className={classes.nounWrapper}>
                    <StandaloneNounCircular nounId={BigNumber.from(nounId)} />
                </div>
                <div>
                    <h1>Noun {nounId}</h1>
                </div>
            </div>

            {/* Noun birthday */}
            <div className={classes.nounInfoWrapper}>
                <CakeIcon height={20} width={20} className={classes.icon}/>
                <Trans>Born</Trans> <span className={classes.bold}>
                    {i18n.date(birthday)}
                </span>
            </div>


            {/* Current holder */}
            <div className={classes.nounInfoWrapper}>
                <HeartIcon height={20} width={20} className={classes.icon}/>
                <span>
                <Trans>Held by</Trans> 
                </span>
                <span className={classes.bold}>
                <ShortAddress address={data.noun.owner.id}/>
                </span>
            </div>

            <p className={classes.cta}>
                <Trans>View Noun Profile</Trans>→
            </p>

        </div>
    );
};

export default NounHoverCard;
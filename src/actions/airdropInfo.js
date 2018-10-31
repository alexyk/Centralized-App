import {airdropInfo} from './actionTypes';

export function setAirdropInfo(email, facebookProfile, telegramProfile, twitterProfile, redditProfile, refLink, participates, isVerifyEmail, referralCount, isCampaignSuccessfullyCompleted, voteUrl, finalizedStatus) {
  return {
    type: airdropInfo.SET_AIRDROP_INFO,
    email,
    facebookProfile,
    telegramProfile,
    twitterProfile,
    redditProfile,
    participates,
    refLink,
    isVerifyEmail,
    referralCount,
    isCampaignSuccessfullyCompleted,
    voteUrl,
    finalizedStatus
  };
}


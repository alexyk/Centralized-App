import React from "react";
export default class Terms extends React.Component {

  componentDidMount(){
    const script = document.createElement("script");
    script.innerHTML = `var widgetOptions160923 = { bg_color: "transparent" }; (function() { var a = document.createElement("script"), h = "head"; a.async = true; a.src = (document.location.protocol == "https:" ? "https:" : "http:") + "//ucalc.pro/api/widget.js?id=160923&t="+Math.floor(new Date()/18e5); document.getElementsByTagName(h)[0].appendChild(a) })();`;
    script.async = true;

    this.calculator.appendChild(script);

  }

  render(){
    return <div style={{padding: "30px"}}>

      {/*<h1>LockTrip Affiliate Program</h1>*/}

      <div ref={el=>{this.calculator = el}}></div>

      <div className="uCalc_160923"></div>

      {/*<div style={{whiteSpace: "pre-line"}}>{`
LOCKTRIP AFFILIATE AGREEMENT
PLEASE READ THE ENTIRE AGREEMENT.
YOU MAY PRINT THIS PAGE FOR YOUR RECORDS.
THIS IS A LEGAL AGREEMENT BETWEEN YOU AND LOCKTRIP (LockChain ltd).
BY JOINING THIS AFFILIATE PROGRAM, YOU ARE AGREEING THAT YOU HAVE READ, UNDERSTOOD AND ACCEPTED THE TERMS AND CONDITIONS OF THIS AGREEMENT AND THAT YOU AGREE TO BE LEGALLY RESPONSIBLE FOR EACH AND EVERY TERM AND CONDITION.

1. Overview
This Agreement contains the complete terms and conditions that apply to you becoming an affiliate in LockTrip.com's Affiliate Program. The purpose of this Agreement is to allow linking between your account and users you refer to LockTrip.com. Please note that throughout this Agreement, "we," "us," and "our" refer to LockTrip.com, and "you," "your," and "yours" refer to the affiliate.

2. Affiliate Obligations
2.1. To join the program, you need to be registered on the marketplace https://beta.locktrip.com/. To start building your Affiliate Network with us you need to invite people with the unique reference link, which is located in the “Affiliate” tab on your personal dashboard. We may exclude you from the Affiliate Program if we determine that you created a website to generate referrals, which is unsuitable for our Program, including if it:
2.1.1. Promotes sexually explicit materials
2.1.2. Promotes violence
2.1.3. Promotes discrimination based on race, sex, religion, nationality, disability, sexual orientation, or age
2.1.4. Promotes illegal activities
2.1.5. Incorporates any materials which infringe or assist others to infringe on any copyright, trademark or other intellectual property rights or to violate the law
2.1.6. Includes "LOCKTRIP" or variations or misspellings thereof in its domain name
2.1.7. Is otherwise in any way unlawful, harmful, threatening, defamatory, obscene, harassing, or racially, ethnically or otherwise objectionable to us in our sole discretion.
2.1.8. Contains software downloads that potentially enable diversions of commission from other affiliates in our program.
2.1.9. You may not create or design your website or any other website that you operate, explicitly or implied in a manner which resembles our website nor design your website in a manner which leads customers to believe you are LockTrip.com (LockChain ltd) or any other affiliated business.
2.2. As a member of LockTrip.com’s Affiliate Program, you will have access to an automated affiliate account management tool on your personal dashboard https://beta.locktrip.com/profile/affiliates. Here you will be able to various actions, such as but not limited to: keeping track of the number of the affiliates in your network, reviewing the accumulated rewards from your activities, withdrawing your revenue etc.
2.3. LockTrip.com reserves the right, at any time, to review and require that you change any promotional materials that you are using in order to generate referrals, to comply with the guidelines provided to you.
2.4. It is entirely your responsibility to follow all applicable intellectual property and other laws that pertain to your enrollment to this Affiliate Program. You must have express permission to use LockTrip.com (LockChain Ltd.) copyrighted material, whether it be a writing, an image, or any other copyrightable work. We will not be responsible (and you will be solely responsible) if you use another person's copyrighted material or other intellectual property in violation of the law or any third party rights.

3. LockTrip.com Rights and Obligations
3.1. LockTrip.com reserves the right to terminate this Agreement and your participation in the LockTrip.com Affiliate Program immediately and without notice to you should you commit fraud in your use of the LockTrip.com Affiliate Program or should you abuse this program in any way. If such fraud or abuse is detected, LockTrip.com shall not be liable to you for any commissions for such fraudulent actions.
3.2. This Agreement will begin upon your joining the Locktrip.com’s Affiliate Program, and will continue unless terminated hereunder.

4. Termination
This Agreement will terminate immediately upon any breach of this Agreement by you.

5. Modification
We may modify any of the terms and conditions in this Agreement at any time at our sole discretion. In such event, we will make an official announcement. Modifications may include, but are not limited to, changes in the payment procedures and LockTrip.com’s Affiliate Program rules.

6. Promotion Restrictions
6.1. You are free to promote your own web sites, but naturally any promotion that mentions LockTrip.com could be perceived by the public or the press as a joint effort. You should know that certain forms of advertising are always prohibited by LockTrip.com. For example, advertising commonly referred to as "spamming" is unacceptable to us and could cause damage to our name. Other generally prohibited forms of advertising include the use of unsolicited commercial email (UCE), postings to non-commercial newsgroups and cross-posting to multiple newsgroups at once. In addition, you may not advertise in any way that effectively conceals or misrepresents your identity, your domain name, or your return email address. You may use mailings to customers to promote LockTrip.com so long as the recipient is already a customer or subscriber of your services or web site, and recipients have the option to remove themselves from future mailings. Also, you may post to newsgroups to promote LockTrip.com so long as the news group specifically welcomes commercial messages. At all times, you must clearly represent yourself and your web sites as independent from LockTrip.com. If it comes to our attention that you are spamming, we will consider that cause for immediate termination of this Agreement and your participation in the LockTrip.com Affiliate Program. Any pending balances owed to you will not be paid if your account is terminated due to such unacceptable advertising or solicitation.
6.2. Affiliates that among other keywords or exclusively bid in their Pay-Per-Click campaigns on keywords such as LockTrip.com, LockTrip, www.LockTrip, www.LockTrip.com, and/or any misspellings or similar alterations of these – be it separately or in combination with other keywords – and do not direct the traffic from such campaigns to their own website prior to re-directing it to ours, will be considered trademark violators, and will be banned from LockTrip.com’s Affiliate Program. We will do everything possible to contact the affiliate prior to the ban. However, we reserve the right to expel any trademark violator from our affiliate program without prior notice, and on the first occurrence of such PPC bidding behavior.
6.3. Affiliates are not prohibited from keying in prospect’s information into the lead form as long as the prospects’ information is real and true, and these are valid leads (i.e. sincerely interested in LockTrip’s service).
6.4. Affiliate shall not transmit any so-called “interstitials,” “Parasiteware™,” “Parasitic Marketing,” “Shopping Assistance Application,” “Toolbar Installations and/or Add-ons,” “Shopping Wallets” or “deceptive pop-ups and/or pop-unders” to referrals from the time the referred person clicks on a qualifying link until such time as the referred person has fully exited LockTrip’s site (i.e., no page from our site or any LockTrip’s content or branding is visible on the end-user’s screen). As used herein a. “Parasiteware™” and “Parasitic Marketing” shall mean an application that (a) through accidental or direct intent causes the overwriting of affiliate and non-affiliate commission tracking cookies through any other means than a customer initiated click on a qualifying link on a web page or email; (b) intercepts searches to redirect traffic through an installed software, thereby causing, pop ups, commission tracking cookies to be put in place or other commission tracking cookies to be overwritten where a user would under normal circumstances have arrived at the same destination through the results given by the search (search engines being, but not limited to, Google, MSN, Yahoo, Overture, AltaVista, Hotbot and similar search or directory engines); (c) set commission tracking cookies through loading of LockTrip site in IFrames, hidden links and automatic pop ups that open LockTrip.com’s site; (d) targets text on web sites, other than those web sites 100% owned by the application owner, for the purpose of contextual marketing; (e) removes, replaces or blocks the visibility of Affiliate banners with any other banners, other than those that are on web sites 100% owned by the owner of the application.

7. Grant of Licenses
7.1. We grant to you a non-exclusive, non-transferable, revocable right to (i) access our site through your unique reference link solely in accordance with the terms of this Agreement and (ii) solely in connection with such links, to use our logos, trade names, trademarks, and similar identifying material (collectively, the "Licensed Materials") that we provide to you or authorize for such purpose. You are only entitled to use the Licensed Materials to the extent that you are a member in good standing of LockTrip.com’s Affiliate Program. You agree that all uses of the Licensed Materials will be on behalf of LockTrip.com and the good will associated therewith will inure to the sole benefit of LockTrip.com.
7.2. You agree not to use the LockTrip.com's proprietary materials in any manner that is disparaging, misleading, obscene or that otherwise portrays the party in a negative light. Each party reserves all of its respective rights in the proprietary materials covered by this license.

8. Representations and Warranties
You represent and warrant that:
8.1. This Agreement has been duly and validly executed and delivered by you and constitutes your legal, valid, and binding obligation, enforceable against you in accordance with its terms;
8.2. You have the full right, power, and authority to enter into and be bound by the terms and conditions of this Agreement and to perform your obligations under this Agreement, without the approval or consent of any other party;

9. Limitations of Liability
WE WILL NOT BE LIABLE TO YOU WITH RESPECT TO ANY SUBJECT MATTER OF THIS AGREEMENT UNDER ANY CONTRACT, NEGLIGENCE, TORT, STRICT LIABILITY OR OTHER LEGAL OR EQUITABLE THEORY FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL OR EXEMPLARY DAMAGES (INCLUDING, WITHOUT LIMITATION, LOSS OF REVENUE OR GOODWILL OR ANTICIPATED PROFITS OR LOST BUSINESS), EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. FURTHER, NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED IN THIS AGREEMENT, IN NO EVENT SHALL LOCKTRIP.COM'S CUMULATIVE LIABILITY TO YOU ARISING OUT OF OR RELATED TO THIS AGREEMENT, WHETHER BASED IN CONTRACT, NEGLIGENCE, STRICT LIABILITY, TORT OR OTHER LEGAL OR EQUITABLE THEORY, EXCEED THE TOTAL COMMISSION FEES PAID TO YOU UNDER THIS AGREEMENT.

10. Indemnification
You hereby agree to indemnify and hold harmless LOCKTRIP.com, and its subsidiaries and affiliates, and their directors, officers, employees, agents, shareholders, partners, members, and other owners, against any and all claims, actions, demands, liabilities, losses, damages, judgments, settlements, costs, and expenses (including reasonable attorneys' fees) (any or all of the foregoing hereinafter referred to as "Losses") insofar as such Losses (or actions in respect thereof) arise out of or are based on (i) any claim that our use of the affiliate trademarks infringes on any trademark, trade name, service mark, copyright, license, intellectual property, or other proprietary right of any third party, (ii) any misrepresentation of a representation or warranty or breach of a covenant and agreement made by you herein, or (iii) any claim related to your site, including, without limitation, content therein not attributable to us.

11. Miscellaneous
11.1. You agree that you are an independent commissioner, and nothing in this Agreement will create any partnership, joint venture, agency, franchise, sales representative, or employment relationship between you and LOCKTRIP.com. You will have no authority to make or accept any offers or representations on our behalf. You will not make any statement, whether on Your Site or any other of Your Site or otherwise, that reasonably would contradict anything in this Section.
11.2. This Agreement represents the entire agreement between us and you, and shall supersede all prior agreements and communications of the parties, oral or written.
12.3. The headings and titles contained in this Agreement are included for convenience only, and shall not limit or otherwise affect the terms of this Agreement.
11.4. If any provision of this Agreement is held to be invalid or unenforceable, that provision shall be eliminated or limited to the minimum extent necessary such that the intent of the parties is effectuated, and the remainder of this agreement shall have full force and effect.
`}</div> */}
    </div>;
  }
}

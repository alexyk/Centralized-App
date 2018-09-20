import { Config } from '../../../config';
import Message from './Message';
import MessagesChat from './MessagesChat';
import MessagesChatDay from './MessagesChatDay';
import MessagesChatUser from './MessagesChatUser';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import requester from '../../../requester';
import { withRouter } from 'react-router-dom';

// import InfiniteList from 'react-infinite-scroll-list';

class MessagesChatPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      loading: true,
      recipient: '',
      recipientId: '',
      recipientImage: '',
      sending: false,
      message: '',

      infinityLoading: false,
      totalPages: 0,
      currentPage: 0,
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fetchMessages = this.fetchMessages.bind(this);
  }

  componentDidMount() {
    this.fetchMessages();
  }

  fetchMessages(page = 0) {
    this.setState({ infinityLoading: true });
    requester.getChatMessages(this.props.match.params.id, page).then(res => {
      res.body.then(res => {
        let recipient = res.content[0].recipient.email === localStorage[Config.getValue('domainPrefix') + '.auth.username'] ? res.content[0].sender : res.content[0].recipient;
        let totalMessages = this.state.messages;
        res.content.forEach((item) => {
          totalMessages.push(item);
        });

        this.setState({
          messages: totalMessages,
          loading: false,
          recipient: recipient.fullName,
          recipientId: recipient.id,
          recipientImage: recipient.image,
          totalPages: res.totalPages,
          infinityLoading: false
        });
      });
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  sendMessage(e) {
    e.preventDefault();

    this.setState({ sending: true });

    let message = {
      recipient: this.state.recipientId,
      message: this.state.message
    };
    requester.sendMessage(message, this.props.match.params.id).then(res => {
      res.body.then(data => {
        let messages = this.state.messages;
        messages.splice(0, 0, data);

        this.setState({ sending: false, messages: messages, message: '' });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <div className="loader"></div>;
    }

    let lastRenderedUser = '';
    let lastRenderedDay = '';
    return (
      <div className="container">
        <h2>Conversation with {this.state.recipient}</h2>
        <hr />
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <MessagesChatUser userInfo={{ image: this.state.recipientImage, fullName: this.state.recipient }} />
            </div>
            <div className="col-md-7">
              <div id="chat">
                <form onSubmit={this.sendMessage}>
                  <textarea name="message" value={this.state.message} onChange={this.onChange} required="required" placeholder="Type your message here..."></textarea>
                  <input type="submit" className="button" disabled={this.state.sending} value={this.state.sending ? 'Sending...' : 'Send Message'} />
                </form>

                {this.state.messages && this.state.messages.map((message, i) => {
                  let isQueueMessage = lastRenderedUser === message.sender.email;
                  lastRenderedUser = message.sender.email;

                  let messageDate = moment(message.createdAt, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY');
                  let isNewDay = lastRenderedDay !== messageDate;
                  lastRenderedDay = messageDate;
                  return (<div key={i}>
                    {isNewDay ? <MessagesChatDay date={messageDate} /> : null}
                    <MessagesChat
                      queueMessage={isQueueMessage}
                      sender={message.sender.email === localStorage[Config.getValue('domainPrefix') + '.auth.username']}
                      message={message}>
                      <Message message={message} />
                    </MessagesChat>
                  </div>);
                })}

                {/* <InfiniteList
                                        root="viewport"
                                        isLoading={this.state.infinityLoading}
                                        isEndReached={this.state.currentPage === this.state.totalPages - 1}
                                        onReachThreshold={() => {
                                            this.setState({ currentPage: this.state.currentPage + 1 });
                                            this.fetchMessages(this.state.currentPage);
                                        }}
                                        threshold={180}>
                                        {this.state.messages.map((message, i) => {
                                            let isQueueMessage = lastRenderedUser === message.sender.email;
                                            lastRenderedUser = message.sender.email;

                                            let messageDate = moment(message.createdAt, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY');
                                            let isNewDay = lastRenderedDay !== messageDate;
                                            lastRenderedDay = messageDate;
                                            return (<div key={i}>
                                                {isNewDay ? <MessagesChatDay date={messageDate} /> : null}
                                                <MessagesChat
                                                    queueMessage={isQueueMessage}
                                                    sender={message.sender.email === localStorage[Config.getValue('domainPrefix') + '.auth.username']}
                                                    message={message}>
                                                    <Message message={message} />
                                                </MessagesChat>
                                            </div>);
                                        })}
                                    </InfiniteList> */}
                {this.state.infinityLoading ? <div className="loader"></div> : null}
              </div>
            </div>
            <div className="clear-both before-footer" />
          </div>
        </div>
      </div>
    );
  }
}

MessagesChatPage.propTypes = {
  match: PropTypes.object
};

export default withRouter(MessagesChatPage);
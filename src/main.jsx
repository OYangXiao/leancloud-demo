import React from 'react'
import ReactDOM from 'react-dom'

const Realtime = require('leancloud-realtime').Realtime,
    realtime = new Realtime({
        appId: "DqsTyylyEUjYeo6HDEaxDRGc-gzGzoHsz",
        region: "cn"
    }),
    TextMessage = require('leancloud-realtime').TextMessage


class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imclient: null
        }
    }

    createClient = (myName, toName) => {
        this.toName = toName
        this.myName = myName
        if (!this.state.imclient) {
            realtime.createIMClient(myName).then((client) => {
                client.on('unreadmessagescountupdate', (payload, unreadConversations) => {
                    console.log(payload, unreadConversations)
                    try {
                        if (Object.prototype.toString.call(unreadConversations) === '[object Array]') {
                            for (let conv of unreadConversations) {
                                // console.log(conv.name, conv.unreadMessagesCount)
                            }
                        } else {
                            // console.log(unreadConversations)
                        }
                    } catch (err) {
                        throw err
                    }
                })
                return this.setState({ imclient: client })
                // return client.getQuery().withLastMessagesRefreshed().containsMembers([myName]).find()
            }).catch(console.error)
        }
    }

    render() {
        return (
            <div>
                {this.state.imclient ?
                    <div>
                        当前客户端id: {this.state.imclient.id}
                        <Conversation imclient={this.state.imclient} toName={this.toName} myName={this.myName} />
                    </div>
                    :
                    <div>
                        <label
                            style={{ backgroundColor: "#aaa", padding: "5px", borderRadius: "4px", color: "#fff" }}
                            onClick={() => this.createClient('58f4894548389d40189d108f', 'server')}>
                            createUserClient
                        </label>
                        <label
                            style={{ backgroundColor: "#aaa", padding: "5px", borderRadius: "4px", color: "#fff" }}
                            onClick={() => this.createClient('server2', '58f4894548389d40189d108f')}>
                            createServerClient
                        </label>
                    </div>
                }
            </div>
        )
    }
}

class Conversation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tempMessage: "",
            conversation: null
        }
    }

    componentDidMount() {
        this.props.imclient.createConversation({
            members: [this.props.toName, this.props.myName],
            name: 'test12',
            unique: true
        }).then((conv) => {
            return this.setState({ conversation: conv })
        }).catch(console.error)
    }

    writeMessage = (e) => {
        this.setState({ tempMessage: e.target.value })
    }

    sendMessage = () => {
        this.state.conversation.send(new TextMessage(this.state.tempMessage))
            .then(function (message) {
                console.log(message)
            }).catch(console.error)
    }

    render() {
        if (this.state.conversation) {
            return (
                <div>
                    conversation name: {this.state.conversation.name}
                    <br />
                    <input type="text" onChange={this.writeMessage} value={this.state.tempMessage} />
                    <label style={{ padding: "5px", backgroundColor: "#aaa", color: "#fff" }} onClick={this.sendMessage}>发送</label>
                </div>
            )
        } else {
            return null
        }
    }
}


ReactDOM.render(
    <Main />,
    document.getElementById('entrance')
)


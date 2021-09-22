import React, { Component } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import {
  notifications,
  messages,
  NotificationMessage,
  Android
} from "react-native-firebase-push-notifications"

class RootContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: "",
      hasPermission: false
    }
  }

  componentDidMount() {
    this.onNotificationListener()
    this.onNotificationOpenedListener()
    this.getInitialNotification()
  }
  componentWillUnmount() {}

  getToken = async () => {
    //get the messeging token
    const token = await notifications.getToken()
    //you can also call messages.getToken() (does the same thing)
    return token
  }
  getInitialNotification = async () => {
    //get the initial token (triggered when app opens from a closed state)
    const notification = await notifications.getInitialNotification()
    console.log("getInitialNotification", notification)
    return notification
  }

  onNotificationOpenedListener = () => {
    this.removeOnNotificationOpened = notifications.onNotificationOpened(
      notification => {
        console.log("onNotificationOpened", notification)
      }
    )
  }

  onNotificationListener = () => {
    this.removeOnNotification = notifications.onNotification(notification => {
      //do something with the notification
      console.log("onNotification", notification)
    })
  }

  onTokenRefreshListener = () => {
    this.removeonTokenRefresh = messages.onTokenRefresh(token => {
      //do something with the new token
    })
  }

  componentWillUnmount() {
    //remove the listener on unmount
    if (this.removeOnNotificationOpened) {
      this.removeOnNotificationOpened()
    }
    if (this.removeOnNotification) {
      this.removeOnNotification()
    }

    if (this.removeonTokenRefresh) {
      this.removeonTokenRefresh()
    }
  }

  onTokenButtonPress = async () => {
    const token = await this.getToken()
    console.log("token : ", token)
    this.setState({ token: token })
  }

  onTestHasPermission = async () => {
    const has = await this.hasPermission()
    console.log("Has", has)
    this.setState({ hasPermission: has })
  }
  render() {
    const { token, hasPermission } = this.state

    return (
      <View style={{ flex: 3 }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{
              // backgroundColor: "red",
              flex: 1,
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={() => this.onTokenButtonPress()}
          >
            <Text>Get Token</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center"
            // backgroundColor: "blue"
          }}
        >
          <Text>Token : {token}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "red" }}>
          <TouchableOpacity
            style={{
              // backgroundColor: "orange",
              flex: 1,
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={async () => {
              const channel = new Android.Channel(
                "test-channel",
                "Test Channel",
                Android.Importance.Max
              ).setDescription("My apps test channel")

              // Create the channel
              notifications.android().createChannel(channel)
              const c = await notifications.displayNotification(
                new NotificationMessage()
                  .setNotificationId("notification-id")
                  .setTitle("Notification title")
                  .setBody("Notification body")
                  .setData({
                    key1: "key1",
                    key2: "key2"
                  })
                  .android.setChannelId("test-channel")
              )
            }}
          >
            <Text>display notification</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default RootContainer

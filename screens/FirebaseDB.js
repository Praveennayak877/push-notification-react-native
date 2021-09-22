import React, { Component } from "react"
import { Button, Text, View, TextInput } from "react-native"
import database from "@react-native-firebase/database"

export default class FirebaseDB extends Component {
  constructor(props) {
    super(props)

    this.state = {
      allUsers: [],
      fname: "",
      lname: "",
      keys: ""
    }
  }

  componentDidMount() {
    const allUsers = database().ref("usersList")
    allUsers.on("value", snapshot => {
      //   console.log(snapshot.val())
      this.setState({ allUsers: snapshot.val() })
    })
  }

  addUser() {
    const { fname } = this.state

    const userKeys = Object.keys(this.state.allUsers)
    this.setState({ keys: userKeys[0] })

    database()
      .ref(`usersList/${userKeys[0]}`)
      .push({
        name: fname
      })
      .then(data => console.log("User added", data))
      .catch(error => console.log("Error adding user", error))

    this.setState({ newUser: "" })
  }

  //   newKey = keys => {
  //       this.setState({ keys })
  //   }

  render() {
    // console.log("usersList", this.state.allUsers)

    return (
      <View>
        <Text>Firebase realtime database</Text>
        <View>
          <Text>Add new user:</Text>
          <TextInput
            value={this.state.newUser}
            onChangeText={text => this.setState({ fname: text })}
            placeholder="Enter new user"
          />
          <Button title="Add new user" onPress={() => this.addUser()} />
        </View>
        {/* {userKeys &&
        userKeys !== [] &&
        userKeys !== null &&
        userKeys !== undefined &&
        userKeys.length > 0
          ? userKeys.map((user, index) => {
              //   console.log("map", user)
              this.newKey(userKeys[index])
              //   return (
              //     <View
              //       style={{
              //         backgroundColor: "red",
              //         marginVertical: "3%",
              //         width: "50%",
              //         alignItems: "center"
              //       }}
              //       key={index}
              //     >
              //       <Text style={{ color: "white", fontSize: 20 }}>
              //         {user.name}
              //       </Text>
              //     </View>
              //   )
            })
          : null} */}
      </View>
    )
  }
}

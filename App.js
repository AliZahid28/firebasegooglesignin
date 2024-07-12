// import React from 'react';
// import {
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   View,
//   Text,
//   Dimensions,
//   TouchableOpacity,
//   Image
// } from 'react-native';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// import { auth } from '@react-native-firebase/auth';

// GoogleSignin.configure({
//   webClientId: '924413303774-vn419df57c11ed7d6df9hlmaeslf628a.apps.googleusercontent.com',
// });
// const App = () => {

//   const googleLogin = async () => {
//     try {
//         await GoogleSignin.hasPlayServices();
//         const userInfo = await GoogleSignin.signIn();
//         console.log("userinfo", userInfo);
//         const googlecredentials = auth.GoogleAuthProvider.credential(userInfo)
//         console.log('hey =====',googlecredentials)

//     } catch (error) {
//         if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//             console.log(error)
//         } else if (error.code === statusCodes.IN_PROGRESS) {
//             console.log(error)
//         } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//             console.log(error)
//         } else {
//         }
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" />
//       <View style={styles.container}>
//         <View style={styles.topContent}>
//           <Text style={styles.mainText}>
//             Social Auth
//           </Text>
//         </View>
//         <View style={styles.bottomContent}>
//           <TouchableOpacity onPress={()=>googleLogin()} style={styles.googleButton}>
//             <Image
//               style={styles.googleIcon}
//               source={{
//                 uri: "https://i.ibb.co/j82DCcR/search.png",
//               }}
//             />
//             <Text style={styles.googleButtonText}>Sign in with Google</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };
// const styles = StyleSheet.create({
//   safeArea: {
//     backgroundColor: "#262b2f"
//   },
//   container: {
//     height: Dimensions.get('window').height,
//     backgroundColor: "#262b2f",
//   },
//   topContent: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   bottomContent: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   mainText: {
//     fontSize: 54,
//     color: "white",
//   },
//   googleButton: {
//     backgroundColor: "white",
//     borderRadius: 4,
//     paddingHorizontal: 34,
//     paddingVertical: 16,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   googleButtonText: {
//     marginLeft: 16,
//     fontSize: 18,
//     fontWeight: '600'
//   },
//   googleIcon: {
//     height: 24,
//     width: 24
//   }
// });
// export default App;
import React, { useState } from 'react';
import { View, Button, Text, ActivityIndicator, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '924413303774-vn419df57c11ed7d6df9hlmaeslf628a.apps.googleusercontent.com', // From Google Cloud Console
});

const App = () => {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(false)

  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    setLoader(true)
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };

  const signOut = async () => {
    try {
      console.log('first')
      setLoader(true)
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      console.log('second')

      auth().signOut();
      // setLoader(false)
      setUser(null); // Remember to set the user to null
    } catch (error) {
      console.error(error);
    }
  };

  auth().onAuthStateChanged((user) => {
    if (user) {
      console.log('state change')
      setLoader(false)
      setUser(user);
    }
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {user ? (
        <View>
          <Text>Welcome {user.displayName}</Text>
          <Button title="Sign Out" onPress={() => signOut()} />
        </View>
      ) : (
        <Button
          title="Google Sign-In"
          onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
        />
      )}
      {loader && <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>}
    </View>
  );
};

export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // No backgroundColor is specified here, making it transparent by default
  },
});
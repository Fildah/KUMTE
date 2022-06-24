import React from "react";
import { Button, StyleSheet, View, Dimensions } from "react-native";

import MapView, { Marker } from "react-native-maps";

var latitude, longitude;

class MapsScreen extends React.Component {
  render() {
    if (this.props.route.params) {
      latitude = this.props.route.params.latitude;
      longitude = this.props.route.params.longitude;
    } else {
      latitude = 37.4220936;
      longitude = -122.083922;
    }
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={styles.map}
        >
          <Marker
            key="1"
            coordinate={{
              latitude: 37.4220936,
              longitude: -122.083922,
            }}
            title="Google"
            description={"Google"}
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default MapsScreen;

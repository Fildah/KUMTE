import { React, useState } from "react";
import {
  Button,
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Linking,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Location from "expo-location";

const DetailsScreen = (props) => {
  let placeItemsStorage = [];
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weather, setWeather] = useState(null);
  const API_KEY = "49cc8c821cd2aff9af04c9f98c36eb74";

  async function GetLocation() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.canAskAgain || permission.status === "denied") {
      Alert.alert(
        "Zamitnuta opravneni",
        "Opravneni na GPS byla zamitnuta prosim povol opravneni",
        [{ text: "OK", onPress: () => Linking.openSettings() }]
      );
      return;
    }

    console.log("zjistuji lokaci");
    let location = await Location.getCurrentPositionAsync({});
    console.log(
      "zjistena lokace " +
        location.coords.latitude +
        " " +
        location.coords.longitude
    );

    if (location) {
      const latitudeData = location.coords.latitude;
      const longitudeData = location.coords.longitude;
      setLatitude(latitudeData);
      setLongitude(longitudeData);
    }
  }

  async function GetWeather() {
    console.log(latitude);
    console.log(longitude);
    if (latitude && longitude) {
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          let current = data.current;
          console.log(current);
          setWeather(current);
        });
    } else {
      Alert.alert(
        "Chybi pozice",
        "V zaznamu chybi pozice. Zjiste nejdrive pozici.",
        [{ text: "OK" }]
      );
    }
  }

  async function DeleteRecord() {
    Alert.alert("Smazani zaznamu", "Opravdu chcete smazat zaznam?", [
      {
        text: "Ano",
        onPress: async () => {
          try {
            placeItemsStorage = JSON.parse(
              await AsyncStorage.getItem("placeItems")
            );
          } catch (error) {
            Alert.alert(error);
          }
          const requiredIndex = placeItemsStorage.findIndex((el) => {
            return el.id === itemID;
          });
          if (requiredIndex !== -1) {
            placeItemsStorage.splice(requiredIndex, 1);
          }
          console.log(placeItemsStorage);
          try {
            await AsyncStorage.setItem(
              "placeItems",
              JSON.stringify(placeItemsStorage)
            );
          } catch (error) {
            Alert.alert(error);
          }
          props.navigation.navigate("Home");
        },
      },
      { text: "Ne" },
    ]);
  }

  function ShowMap() {
    if (latitude && longitude) {
      props.navigation.navigate("MapDetail", {
        latitude,
        longitude,
      });
    } else {
      Alert.alert(
        "Chybi pozice",
        "V zaznamu chybi pozice. Zjiste nejdrive pozici.",
        [{ text: "OK" }]
      );
    }
  }

  const { itemID, itemName } = props.route.params;

  return (
    <View style={styles.container}>
      <View style={styles.detailsWrapper}>
        <View style={styles.detailStandardData}>
          <View style={styles.title}>
            <View style={styles.square}></View>
            <Text style={styles.titleText}>{itemName}</Text>
          </View>
          <Text>ID: {itemID}</Text>
          <View style={styles.detailSection}>
            <Text>Pozice na mape:</Text>
            {latitude && <Text>latitude={latitude}</Text>}
            {longitude && <Text>longitude={longitude}</Text>}
          </View>
          <View style={styles.detailSectionButtons}>
            <Button title="Zjistit lokaci" onPress={GetLocation} />
            <Button title="Zobrazit na mape" onPress={() => ShowMap()} />
          </View>
          <View style={styles.detailSection}>
            <Text>Pocasi v miste: </Text>
            {weather && <Text>soucasna teplota={weather.temp} C</Text>}
          </View>
          <View style={styles.detailSectionButtons}>
            <Button title="Zjistit pocasi v miste" onPress={GetWeather} />
          </View>
        </View>
      </View>
      <View style={styles.divider}></View>
      <TouchableOpacity onPress={() => DeleteRecord()}>
        <View style={styles.trashWrapper}>
          <Ionicons name="trash-outline" size={20} color="black" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  detailsWrapper: {
    paddingHorizontal: 20,
    height: "90%",
  },
  detailStandardData: {
    padding: 15,
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    marginBottom: 20,
    flexDirection: "row",
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  detailSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  detailSectionButtons: {
    flexDirection: "row",
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: "#55BCF6",
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
    marginTop: 10,
  },
  trashWrapper: {
    width: 50,
    height: 50,
    marginRight: 20,
    alignSelf: "flex-end",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    borderBottomColor: "grey",
    borderBottomWidth: 0.8,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default DetailsScreen;

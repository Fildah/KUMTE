import { React, useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PlaceItem from "../components/PlaceItem";

const HomeScreen = (props) => {
  const [place, setPlace] = useState(null);
  const [placeItems, setPlaceItems] = useState([]);
  const [placeItemsCounter, setPlaceItemsCounter] = useState(0);

  const savePlaceItems = async () => {
    try {
      console.log("savePlaceItems");
      await AsyncStorage.setItem("placeItems", JSON.stringify(placeItems));
    } catch (error) {
      Alert.alert(error);
    }
  };

  const loadPlaceItems = async () => {
    try {
      console.log("loadPlaceItems");
      let placeItemsStorage = await AsyncStorage.getItem("placeItems");
      if (placeItems !== []) {
        setPlaceItems(JSON.parse(placeItemsStorage));
      }
    } catch (error) {
      Alert.alert(error);
    }
  };

  const savePlaceItemsCounter = async () => {
    try {
      console.log("savePlaceItemsCounter");
      await AsyncStorage.setItem(
        "placeItemsCounter",
        Number.toString(placeItemsCounter)
      );
    } catch (error) {
      Alert.alert(error);
    }
  };

  const loadPlaceItemsCounter = async () => {
    try {
      console.log("loadPlaceItemsCounter");
      let placeItemsCounterStorage = await AsyncStorage.getItem(
        "placeItemsCounter"
      );
      if (placeItemsCounter !== 0) {
        setPlaceItemsCounter(parseInt(placeItemsCounterStorage));
      }
    } catch (error) {}
  };

  function handleAddPlace() {
    Keyboard.dismiss();
    console.log("Co je v place: ", place);
    setPlaceItems([...placeItems, { id: placeItemsCounter, name: place }]);
    console.log("Co je v placeItems: ", placeItems);
    setPlace(null);
    setPlaceItemsCounter(placeItemsCounter + 1);
  }

  useEffect(() => {
    loadPlaceItems();
    loadPlaceItemsCounter();
  }, []);

  useEffect(() => {
    if (placeItems !== []) {
      savePlaceItems();
    }
  }, [placeItems]);

  useEffect(() => {
    if (placeItemsCounter !== []) {
      savePlaceItemsCounter();
    }
  }, [placeItemsCounter]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.placesWrapper}>
          <View style={styles.items}>
            {placeItems &&
              placeItems.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      props.navigation.push("Details", {
                        itemID: item.id,
                        itemName: item.name,
                      })
                    }
                  >
                    <PlaceItem text={item.name} />
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writePlaceWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder={"Tak kde jsi byl dnes?"}
          value={place}
          onChangeText={(text) => setPlace(text)}
        />
        <TouchableOpacity onPress={() => handleAddPlace()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  placesWrapper: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items: {
    marginTop: 30,
  },
  writePlaceWrapper: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 50,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 270,
  },
  addWrapper: {
    width: 50,
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  addText: {
    fontSize: 25,
  },
});

export default HomeScreen;

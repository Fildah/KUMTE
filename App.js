import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeScreen from "./app/screens/HomeScreen";
import DetailsScreen from "./app/screens/DetailsScreen";
import MapsScreen from "./app/screens/MapsScreen";

const MainStack = createNativeStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="Details" component={DetailsScreen} />
      <MainStack.Screen name="MapDetail" component={MapsScreen} />
    </MainStack.Navigator>
  );
}

const MapStack = createNativeStackNavigator();

function MapStackScreen() {
  return (
    <MapStack.Navigator>
      <MapStack.Screen name="AllMarkers" component={MapsScreen} />
    </MapStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Main") {
              iconName = "list-circle-outline";
            } else if (route.name === "Map") {
              iconName = "map";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerShown: false,
          tabBarActiveTintColor: "#55BCF6",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Main" component={MainStackScreen} />
        <Tab.Screen name="Map" component={MapStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

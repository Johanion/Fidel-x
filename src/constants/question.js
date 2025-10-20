// import { supabase } from "../lib/supabase";
// import { useQuery } from "@tanstack/react-query";
// import { StyleSheet, ActivityIndicator, View, Text } from "react-native";

// const fetchPosts = async () => {
//   const { data, error } = await supabase.from("biology_2014").select("*");
//   if (error) throw error;
//   return data;
// };

// export default function QuizScreen() {
//   const {
//     data: quiz,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["biology_2014"],
//     queryFn: fetchPosts(),
//   });

//   if (isLoading) {
//     return (
//       <View style={styles.overlay}>
//         <View style={styles.container}>
//           <ActivityIndicator size="large" color="#060706ff" />
//           <Text style={styles.text}>Loading...</Text>
//         </View>
//       </View>
//     );
//   }

//   if (error) {
//     console.error("Supabase error:", error);
//     return <Text>Error fetching exam: {error.message}</Text>;
//   }

//   console.log("data:", quiz);

//   return (
//     <View>
//       <Text>Fetched {quiz?.length} questions</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.3)",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   container: {
//     width: 120,
//     height: 120,
//     backgroundColor: "white",
//     borderRadius: 60,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 10,
//   },
//   text: {
//     marginTop: 10,
//     fontSize: 14,
//     color: "#333",
//     fontWeight: "500",
//     textAlign: "center",
//   },
// });

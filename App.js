import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Pressable,
  TextInput
} from 'react-native';
import MoodButton from './components/MoodButton';
import SuggestionCard from './components/SuggestionCard';

export default function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedSubMood, setSelectedSubMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0); // 0: initial, 1: submood, 2: analysis
  const [suggestion, setSuggestion] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Mots-clés pour l'analyse du texte avec solutions personnalisées
  const keywordSolutions = [
    { keywords: ["fatigué", "épuisé", "lassé"], category: "Fatigue", solution: "Faites une pause de 10 minutes sans écran, idéalement à l'extérieur." },
    { keywords: ["stress", "angoisse", "anxieux", "pression"], category: "Stress", solution: "Essayez 3 respirations profondes lentes, inspirez 4 secondes, expirez 6 secondes." },
    { keywords: ["triste", "chagrin", "pleurer"], category: "Tristesse", solution: "Prenez quelques minutes pour écrire ce que vous ressentez ou écoutez une musique qui vous apaise." },
    { keywords: ["colère", "énervé", "frustré"], category: "Colère", solution: "Bougez votre corps : faites 10 squats ou marchez rapidement 5 minutes pour évacuer la tension." },
    { keywords: ["débordé", "submergé"], category: "Stress intense", solution: "Identifiez 1 seule chose importante à faire maintenant. Ignorez le reste temporairement." },
    { keywords: ["joie", "heureux", "content"], category: "Positif", solution: "Prenez un instant pour ancrer ce sentiment : souriez, respirez profondément, et mémorisez-le." },
    { keywords: ["solitude", "seul"], category: "Solitude", solution: "Envoyez un petit message à quelqu'un que vous appréciez, même un simple 'Salut'." },
    { keywords: ["sommeil", "dormi"], category: "Manque de sommeil", solution: "Essayez de prévoir une micro-sieste de 10 minutes si possible." },
    { keywords: ["anxiété", "peur"], category: "Anxiété", solution: "Mettez vos deux pieds au sol, fermez les yeux et concentrez-vous sur votre respiration 1 minute." }
  ];

  // Définition des humeurs disponibles
  const moods = [
    { name: "Joie", emoji: "😊" },
    { name: "Stress", emoji: "😰" },
    { name: "Fatigue", emoji: "😴" },
    { name: "Colère", emoji: "😡" },
  ];
  
  // Sous-catégories d'humeurs
  const subMoods = {
    "Joie": [
      { name: "Excité(e)", level: 3 },
      { name: "Content(e)", level: 2 },
      { name: "Serein(e)", level: 1 }
    ],
    "Stress": [
      { name: "Anxieux(se)", level: 3 },
      { name: "Pressé(e)", level: 2 },
      { name: "Préoccupé(e)", level: 1 }
    ],
    "Fatigue": [
      { name: "Épuisé(e)", level: 3 },
      { name: "Fatigué(e)", level: 2 },
      { name: "Légèrement fatigué(e)", level: 1 }
    ],
    "Colère": [
      { name: "Furieux(se)", level: 3 },
      { name: "Frustré(e)", level: 2 },
      { name: "Irrité(e)", level: 1 }
    ]
  };

  // Suggestions avancées basées sur l'humeur et sa sous-catégorie
  const advancedSuggestions = {
    "Joie": {
      "Excité(e)": "Canalisez cette énergie positive en planifiant un projet créatif qui vous passionne. Écrivez 3 étapes concrètes pour démarrer. Cette émotivité peut être un excellent moteur de créativité quand elle est bien dirigée.",
      "Content(e)": "Profitez de votre énergie positive pour noter trois choses qui vous rendent reconnaissant aujourd'hui. Cela peut renforcer votre bien-être et prolonger ce sentiment de joie.",
      "Serein(e)": "Votre calme intérieur est précieux. Prenez 5 minutes pour savourer pleinement cette paix en pratiquant la pleine conscience. Observez les sensations de légèreté et de contentement dans votre corps."
    },
    "Stress": {
      "Anxieux(se)": "Pratiquez cette technique anti-anxiété : respirez profondément en comptant jusqu'à 4, retenez 2 secondes, expirez lentement sur 6 secondes. Répétez 8 fois en vous concentrant uniquement sur votre respiration.",
      "Pressé(e)": "Prenez 2 minutes pour écrire les 3 tâches les plus importantes de votre journée. Ensuite, identifiez ce qui peut être reporté. Notre algorithme montre que cette action réduit le stress de 27%.",
      "Préoccupé(e)": "Notez la pensée qui vous préoccupe, puis écrivez une action concrète que vous pouvez faire aujourd'hui pour l'adresser. Ceci transforme l'inquiétude en plan d'action."
    },
    "Fatigue": {
      "Épuisé(e)": "Votre corps a besoin d'une récupération active. Hydratez-vous immédiatement (250ml d'eau), puis trouvez un espace calme pour une relaxation de 15 minutes sans écran. Votre cerveau est en déficit énergétique.",
      "Fatigué(e)": "Prenez 10 minutes pour marcher doucement sans téléphone. L'exposition à la lumière naturelle et le mouvement léger peuvent vous redonner de l'énergie sans épuiser vos réserves.",
      "Légèrement fatigué(e)": "Faites une pause de 5 minutes: étirez-vous et buvez un verre d'eau. Notre analyse montre que vous avez besoin d'une micro-pause pour maintenir votre niveau de concentration."
    },
    "Colère": {
      "Furieux(se)": "Votre niveau de colère est intense. Isolez-vous 5 minutes et pratiquez la technique 4-7-8: inspirez 4s, retenez 7s, expirez 8s. Ceci réduit l'activité du système nerveux sympathique.",
      "Frustré(e)": "Écrivez pendant 5 minutes sans filtre pour libérer votre frustration. Ensuite, identifiez ce qui vous a réellement affecté et une petite action positive que vous pourriez faire maintenant.",
      "Irrité(e)": "Prenez 3 grandes respirations lentes. Puis demandez-vous: cette irritation sera-t-elle importante demain? Notre analyse suggère que vous êtes sensible à un facteur environnemental temporaire."
    }
  };

  // Fonction pour analyser le texte saisi par l'utilisateur
  const analyzeUserText = () => {
    if (textInput.trim() === '') {
      return;
    }
    
    setLoading(true);
    setLoadingMessageIndex(0);
    const text = textInput.toLowerCase();
    
    // Tableau pour stocker les correspondances trouvées
    let matches = [];
    
    // Recherche des mots-clés dans le texte
    keywordSolutions.forEach(item => {
      item.keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          matches.push({
            category: item.category,
            solution: item.solution,
            keyword: keyword
          });
        }
      });
    });
    
    // Si aucune correspondance n'est trouvée
    if (matches.length === 0) {
      // Solution par défaut générique
      setSuggestion("Prenez un moment pour respirer profondément et faire le point sur votre journée. Une courte pause peut aider à clarifier vos pensées.");
      setSelectedMood("Neutre");
      setSelectedSubMood("État général");
    } 
    // Si plusieurs correspondances sont trouvées, combiner les solutions
    else if (matches.length > 1) {
      // Regrouper par catégorie pour éviter les doublons
      const categories = {};
      matches.forEach(match => {
        if (!categories[match.category]) {
          categories[match.category] = match;
        }
      });
      
      // Extraire des solutions uniques par catégorie
      const uniqueMatches = Object.values(categories);
      
      if (uniqueMatches.length > 1) {
        // Combiner les solutions pour différentes émotions
        let combinedSolution = "Nous avons détecté plusieurs émotions:\n\n";
        uniqueMatches.forEach(match => {
          combinedSolution += `Pour votre état de ${match.category} (${match.keyword}):\n${match.solution}\n\n`;
        });
        setSuggestion(combinedSolution);
        setSelectedMood("Multiple");
        setSelectedSubMood(`${uniqueMatches.length} émotions détectées`);
      } else {
        // Un seul type d'émotion avec plusieurs mots-clés
        const match = uniqueMatches[0];
        setSuggestion(match.solution);
        setSelectedMood(match.category);
        setSelectedSubMood(`Détecté: "${match.keyword}"`);
      }
    } 
    // Une seule correspondance
    else {
      const selectedMatch = matches[0];
      setSuggestion(selectedMatch.solution);
      setSelectedMood(selectedMatch.category);
      setSelectedSubMood(`Détecté: "${selectedMatch.keyword}"`);
    }
    
    // Simuler l'analyse IA avec plusieurs messages de chargement
    let messageCounter = 0;
    const messageInterval = setInterval(() => {
      if (messageCounter < loadingMessages.length - 1) {
        setLoadingMessageIndex(messageCounter + 1);
        messageCounter++;
      } else {
        clearInterval(messageInterval);
        setLoading(false);
        setAnalysisStage(2);
      }
    }, 800);
    
    // Arrêter l'intervalle si l'analyse se termine avant
    setTimeout(() => {
      clearInterval(messageInterval);
    }, 4000);
  };

  // Fonction pour gérer la sélection d'une humeur principale
  const handleMoodSelection = (mood) => {
    setSelectedMood(mood);
    setAnalysisStage(1); // Passe à la sélection de sous-humeur
  };
  
  // Fonction pour ouvrir le mode texte
  const handleTextInputMode = () => {
    setShowTextInput(true);
  };

  // Fonction pour gérer la sélection d'une sous-humeur
  const handleSubMoodSelection = (subMood) => {
    setSelectedSubMood(subMood);
    setLoading(true);
    setAnalysisStage(2); // Passe à l'analyse
    
    // Simuler le processus d'analyse IA (plus complexe et progressif)
    setTimeout(() => {
      setLoading(false);
      setSuggestion(advancedSuggestions[selectedMood][subMood]);
    }, 3000);
  };

  // Fonction pour réinitialiser et revenir à l'écran d'accueil
  const handleReset = () => {
    setSelectedMood(null);
    setSelectedSubMood(null);
    setLoading(false);
    setSuggestion(null);
    setAnalysisStage(0);
    setTextInput('');
    setShowTextInput(false);
  };

  const loadingMessages = [
    "Analyse sémantique de votre texte...",
    "Identification des émotions...",
    "Calcul de votre état émotionnel...",
    "Préparation d'une recommandation personnalisée..."
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <Text style={styles.title}>MoodCare</Text>
        <Text style={styles.subtitle}>
          {analysisStage === 0 ? "Comment vous sentez-vous aujourd'hui ?" : 
           analysisStage === 1 ? `Précisez votre niveau de ${selectedMood}` : 
           "Analyse de votre humeur..."}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {analysisStage === 0 ? (
          // Écran de sélection d'humeur principale ou saisie de texte
          <>
            {!showTextInput ? (
              // Affichage des boutons d'humeur
              <>
                <View style={styles.moodGrid}>
                  {moods.map((item) => (
                    <MoodButton
                      key={item.name}
                      emoji={item.emoji}
                      mood={item.name}
                      onPress={handleMoodSelection}
                    />
                  ))}
                </View>
                
                <View style={styles.textInputOption}>
                  <Text style={styles.orText}>ou</Text>
                  <Pressable 
                    style={styles.textButton}
                    onPress={handleTextInputMode}>
                    <Text style={styles.textButtonLabel}>Décrivez comment vous vous sentez</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              // Zone de saisie de texte libre
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Je me sens..."
                  value={textInput}
                  onChangeText={setTextInput}
                  multiline
                  numberOfLines={4}
                />
                <Text style={styles.exampleText}>
                  Exemple: "Je me sens fatigué et un peu anxieux à cause du travail"
                </Text>
                <Pressable 
                  style={[styles.analyzeButton, !textInput.trim() && styles.disabledButton]}
                  disabled={!textInput.trim()}
                  onPress={analyzeUserText}
                >
                  <Text style={styles.analyzeButtonText}>Analyser mon humeur</Text>
                </Pressable>
                <Pressable 
                  style={styles.cancelButton}
                  onPress={() => setShowTextInput(false)}
                >
                  <Text style={styles.cancelButtonText}>Revenir au choix</Text>
                </Pressable>
              </View>
            )}}
          </>
        ) : analysisStage === 1 ? (
          // Écran de sélection de sous-humeur
          <View style={styles.moodGrid}>
            {subMoods[selectedMood].map((item) => (
              <Pressable
                key={item.name}
                style={styles.subMoodButton}
                onPress={() => handleSubMoodSelection(item.name)}
              >
                <Text style={styles.subMoodText}>{item.name}</Text>
                <View style={styles.levelIndicator}>
                  {Array.from({length: item.level}).map((_, i) => (
                    <View key={i} style={styles.levelDot} />
                  ))}
                </View>
              </Pressable>
            ))}
          </View>
        ) : loading ? (
          // Écran de chargement avancé (simulant une analyse IA sophistiquée)
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>
              {loadingMessages[loadingMessageIndex]}
            </Text>
            <Text style={styles.analysisStepText}>
              {`${loadingMessageIndex + 1}/${loadingMessages.length} - Analyse en cours...`}
            </Text>
          </View>
        ) : (
          // Écran de suggestion amélioré
          <SuggestionCard
            mood={selectedMood}
            suggestion={suggestion}
            onReset={handleReset}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
    textAlign: 'center',
  },
  content: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  subMoodButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    margin: 8,
    width: '92%',
    elevation: 2,
  },
  subMoodText: {
    fontSize: 16,
    fontWeight: '500',
  },
  levelIndicator: {
    flexDirection: 'row',
    marginTop: 8,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A90E2',
    marginRight: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
  },
  analysisStepText: {
    marginTop: 10,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  textInputOption: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  orText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 15,
  },
  textButton: {
    backgroundColor: '#e0f0ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  textButtonLabel: {
    color: '#4A90E2',
    fontWeight: '500',
    fontSize: 16,
  },
  textInputContainer: {
    padding: 15,
    width: '100%',
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  exampleText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 5,
  },
  analyzeButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: '#bbb',
  },
  analyzeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
});
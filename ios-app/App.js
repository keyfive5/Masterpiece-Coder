import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

const BG = '#090b10';
const ACCENT = '#7c8cff';

// The phone app is the same web app, so a fix ships to iPhone the moment it is
// pushed — no App Store round trip for anything but the shell itself.
const APP_URL = 'https://keyfive5.github.io/Masterpiece-Coder/';

/**
 * Tells the web app it is inside the native shell, so it hides the desktop
 * window buttons and keeps the phone layout even if the viewport is wide
 * (iPad). Runs before the page's own scripts.
 */
const PRELOAD = `
  window.__MC_NATIVE__ = true;
  window.__MC_PLATFORM__ = 'ios';
  true;
`;

export default function App() {
  const webRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [key, setKey] = useState(0);

  const retry = useCallback(() => {
    setFailed(false);
    setKey((n) => n + 1);
  }, []);

  if (failed) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <SafeAreaView style={styles.safe}>
          <View style={styles.centre}>
            <View style={styles.mark} />
            <Text style={styles.title}>Can't reach Masterpiece Coder</Text>
            <Text style={styles.body}>
              This app needs a connection to load. Check your signal and try again.
            </Text>
            <Pressable style={styles.button} onPress={retry}>
              <Text style={styles.buttonText}>Try again</Text>
            </Pressable>
            <Pressable onPress={() => Linking.openURL(APP_URL)}>
              <Text style={styles.link}>Open in Safari instead</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
        <WebView
          key={key}
          ref={webRef}
          source={{ uri: APP_URL }}
          style={styles.web}
          originWhitelist={['https://*']}
          injectedJavaScriptBeforeContentLoaded={PRELOAD}
          domStorageEnabled
          javaScriptEnabled
          // The sign-in flow opens a popup; keep it in the same view.
          setSupportMultipleWindows={false}
          javaScriptCanOpenWindowsAutomatically
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          keyboardDisplayRequiresUserAction={false}
          scalesPageToFit={false}
          bounces={false}
          overScrollMode="never"
          pullToRefreshEnabled={false}
          onError={() => setFailed(true)}
          onHttpError={(event) => {
            // A 404 here means the site is not published yet.
            if (event.nativeEvent.statusCode >= 400) setFailed(true);
          }}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.centre}>
              <View style={styles.mark} />
              <ActivityIndicator size="large" color={ACCENT} style={{ marginTop: 18 }} />
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  web: { flex: 1, backgroundColor: BG },
  centre: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG,
    paddingHorizontal: 32,
  },
  mark: {
    width: 62,
    height: 62,
    borderRadius: 19,
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOpacity: 0.55,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
  },
  title: { color: '#e8ecf4', fontSize: 20, fontWeight: '700', marginTop: 22, textAlign: 'center' },
  body: { color: '#949db2', fontSize: 15, lineHeight: 22, marginTop: 10, textAlign: 'center' },
  button: {
    marginTop: 22,
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 12,
    backgroundColor: ACCENT,
  },
  buttonText: { color: '#0b0e14', fontWeight: '700', fontSize: 15 },
  link: { color: '#48d8e6', marginTop: 16, fontSize: 14 },
});

import React, { useState, useRef, useEffect, useId } from 'react';
import {
  Smartphone,
  Globe,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
  Layers,
  Sparkles,
  Settings,
  HelpCircle,
  Copy,
  Check,
  Code,
  FileText,
  Eye,
  ExternalLink,
  Wifi,
  WifiOff,
  ChevronRight,
  Monitor,
  RotateCw,
  FolderArchive,
  Terminal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import { ToolDefinition } from '../../types';
import { downloadBlob } from '../../lib/downloadManager';

interface Props {
  tool: ToolDefinition;
}

const COLOR_PRESETS = [
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Slate', hex: '#334155' },
];

const JAVA_RESERVED_WORDS = new Set([
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
  'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
  'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
  'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package',
  'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
  'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
  'try', 'void', 'volatile', 'while'
]);

export const WebsiteToAndroidAppConverter: React.FC<Props> = ({ tool }) => {
  // Input fields
  const [websiteUrl, setWebsiteUrl] = useState<string>('https://example.com');
  const [appName, setAppName] = useState<string>('My Web App');
  const [packageId, setPackageId] = useState<string>('com.example.mywebapp');
  const [versionName, setVersionName] = useState<string>('1.0.0');
  const [versionCode, setVersionCode] = useState<number>(1);
  const [primaryColor, setPrimaryColor] = useState<string>('#4f46e5');
  const [splashText, setSplashText] = useState<string>('Welcome to My Web App');
  const [splashDuration, setSplashDuration] = useState<number>(2000);

  // WebView features
  const [enablePullToRefresh, setEnablePullToRefresh] = useState<boolean>(true);
  const [enableProgressBar, setEnableProgressBar] = useState<boolean>(true);
  const [enableOfflineScreen, setEnableOfflineScreen] = useState<boolean>(true);
  const [enableBackNav, setEnableBackNav] = useState<boolean>(true);
  const [allowCleartext, setAllowCleartext] = useState<boolean>(false);

  // App Icon
  const [iconDataUrl, setIconDataUrl] = useState<string | null>(null);
  const [iconFileName, setIconFileName] = useState<string | null>(null);

  // Status & Previews
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'live' | 'splash' | 'offline'>('live');
  const [activeGuideTab, setActiveGuideTab] = useState<'studio' | 'run' | 'apk' | 'security'>('studio');
  const [previewKey, setPreviewKey] = useState<number>(0);
  const [isIframeBlocked, setIsIframeBlocked] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate Unique Element IDs for clean Accessibility
  const urlInputId = useId();
  const appNameInputId = useId();
  const packageInputId = useId();
  const versionNameInputId = useId();
  const versionCodeInputId = useId();
  const splashTextInputId = useId();
  const splashDurationInputId = useId();
  const primaryColorInputId = useId();

  // URL Validation
  const getUrlError = (url: string): string | null => {
    if (!url.trim()) return 'Website URL is required.';
    try {
      const parsed = new URL(url.trim());
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return 'URL must start with http:// or https://';
      }
      if (!parsed.hostname || !parsed.hostname.includes('.')) {
        return 'Please enter a valid domain name (e.g., https://example.com).';
      }
      return null;
    } catch {
      return 'Please enter a valid, well-formed URL (e.g., https://example.com).';
    }
  };

  // Package ID Validation
  const getPackageIdError = (pkg: string): string | null => {
    if (!pkg.trim()) return 'Package ID is required.';
    const trimmed = pkg.trim();
    const parts = trimmed.split('.');
    if (parts.length < 2) {
      return 'Package ID must have at least 2 segments separated by dots (e.g., com.example.app).';
    }
    const segmentRegex = /^[a-z][a-z0-9_]*$/;
    for (const seg of parts) {
      if (!segmentRegex.test(seg)) {
        return `Segment "${seg}" is invalid. Each segment must start with a lowercase letter and contain only lowercase letters, digits, or underscores.`;
      }
      if (JAVA_RESERVED_WORDS.has(seg)) {
        return `Segment "${seg}" is a reserved Java keyword. Please choose another name.`;
      }
    }
    return null;
  };

  // App Name Validation
  const getAppNameError = (name: string): string | null => {
    if (!name.trim()) return 'App Name cannot be empty.';
    if (name.trim().length > 50) return 'App Name is too long (maximum 50 characters).';
    return null;
  };

  const urlError = getUrlError(websiteUrl);
  const packageError = getPackageIdError(packageId);
  const appNameError = getAppNameError(appName);
  const isValid = !urlError && !packageError && !appNameError;

  // Auto-generate package ID from URL & App Name
  const handleAutoGeneratePackageId = () => {
    try {
      const parsed = new URL(websiteUrl);
      const hostParts = parsed.hostname.replace(/^www\./, '').split('.').filter(Boolean);
      let tld = 'com';
      let domain = 'example';
      if (hostParts.length >= 2) {
        tld = hostParts[hostParts.length - 1].toLowerCase().replace(/[^a-z]/g, '') || 'com';
        domain = hostParts[hostParts.length - 2].toLowerCase().replace(/[^a-z0-9]/g, '') || 'app';
      } else if (hostParts.length === 1) {
        domain = hostParts[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'app';
      }
      const safeAppName = appName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 15) || 'app';
      const candidate = `${tld}.${domain}.${safeAppName}`;
      setPackageId(candidate);
    } catch {
      setPackageId('com.example.mywebapp');
    }
  };

  // Handle Icon File Upload
  const handleIconUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, SVG, or WebP).');
      return;
    }
    setIconFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setIconDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleIconUpload(e.dataTransfer.files[0]);
    }
  };

  // Helper: Darken hex color for Android status bar
  const adjustColorBrightness = (hex: string, percent: number): string => {
    let num = parseInt(hex.replace('#', ''), 16);
    let r = (num >> 16) + Math.round(255 * (percent / 100));
    let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
    let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Helper: Escape XML strings
  const xmlEscape = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, "\\'");
  };

  // Helper: Convert canvas to PNG blob
  const renderIconToBlob = (
    size: number,
    isRound: boolean
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(new Blob());
        return;
      }

      const drawDefault = () => {
        // Background
        ctx.fillStyle = primaryColor;
        if (isRound) {
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Rounded rect
          const radius = size * 0.22;
          ctx.beginPath();
          ctx.moveTo(radius, 0);
          ctx.lineTo(size - radius, 0);
          ctx.quadraticCurveTo(size, 0, size, radius);
          ctx.lineTo(size, size - radius);
          ctx.quadraticCurveTo(size, size, size - radius, size);
          ctx.lineTo(radius, size);
          ctx.quadraticCurveTo(0, size, 0, size - radius);
          ctx.lineTo(0, radius);
          ctx.quadraticCurveTo(0, 0, radius, 0);
          ctx.closePath();
          ctx.fill();
        }

        // Draw letter initials or phone glyph
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${Math.round(size * 0.45)}px sans-serif`;
        const initials = appName.trim().slice(0, 2).toUpperCase() || 'W';
        ctx.fillText(initials, size / 2, size / 2 + size * 0.02);
      };

      if (iconDataUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          if (isRound) {
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.clip();
          }
          ctx.drawImage(img, 0, 0, size, size);
          canvas.toBlob((blob) => resolve(blob || new Blob()), 'image/png');
        };
        img.onerror = () => {
          drawDefault();
          canvas.toBlob((blob) => resolve(blob || new Blob()), 'image/png');
        };
        img.src = iconDataUrl;
      } else {
        drawDefault();
        canvas.toBlob((blob) => resolve(blob || new Blob()), 'image/png');
      }
    });
  };

  // Generate and Download Android Studio Project ZIP
  const handleGenerateZip = async () => {
    if (!isValid) return;

    setIsGenerating(true);
    setGenerationStep('Preparing project configuration...');

    try {
      const zip = new JSZip();

      const sanitizedAppName = appName.trim().replace(/[^a-zA-Z0-9 ]/g, '') || 'MyWebApp';
      const rootDirName = sanitizedAppName.replace(/\s+/g, '');
      const packagePath = packageId.replace(/\./g, '/');
      const safeThemeName = sanitizedAppName.replace(/\s+/g, '');
      const primaryDarkHex = adjustColorBrightness(primaryColor, -20);
      const accentHex = primaryColor;

      setGenerationStep('Generating Gradle build scripts...');

      // 1. settings.gradle.kts
      zip.file(
        'settings.gradle.kts',
        `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "${sanitizedAppName}"
include(":app")
`
      );

      // 2. build.gradle.kts (root)
      zip.file(
        'build.gradle.kts',
        `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.3.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.23" apply false
}
`
      );

      // 3. gradle.properties
      zip.file(
        'gradle.properties',
        `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
      );

      // 4. gradle/wrapper/gradle-wrapper.properties
      zip.file(
        'gradle/wrapper/gradle-wrapper.properties',
        `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
      );

      // 5. app/build.gradle.kts
      zip.file(
        'app/build.gradle.kts',
        `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "${packageId}"
    compileSdk = 34

    defaultConfig {
        applicationId = "${packageId}"
        minSdk = 24
        targetSdk = 34
        versionCode = ${versionCode}
        versionName = "${versionName}"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        viewBinding = false
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    implementation("androidx.webkit:webkit:1.11.0")
}
`
      );

      // 6. app/proguard-rules.pro
      zip.file(
        'app/proguard-rules.pro',
        `# Proguard optimization rules for WebView
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String);
}
-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void *(android.webkit.WebView, java.lang.String);
}
`
      );

      setGenerationStep('Writing AndroidManifest & permissions...');

      // 7. app/src/main/AndroidManifest.xml
      zip.file(
        'app/src/main/AndroidManifest.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Essential Internet Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.${safeThemeName}"
        android:usesCleartextTraffic="${allowCleartext}">

        <!-- Splash Screen Launcher Activity -->
        <activity
            android:name=".SplashActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:theme="@style/Theme.${safeThemeName}.Splash">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Main WebView Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="false"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:windowSoftInputMode="adjustResize" />

    </application>

</manifest>
`
      );

      setGenerationStep('Generating Kotlin WebView controller...');

      // 8. SplashActivity.kt
      zip.file(
        `app/src/main/java/${packagePath}/SplashActivity.kt`,
        `package ${packageId}

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity

@SuppressLint("CustomSplashScreen")
class SplashActivity : AppCompatActivity() {

    private val splashDuration: Long = ${splashDuration}L

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        Handler(Looper.getMainLooper()).postDelayed({
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
        }, splashDuration)
    }
}
`
      );

      // 9. MainActivity.kt
      zip.file(
        `app/src/main/java/${packagePath}/MainActivity.kt`,
        `package ${packageId}

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.View
import android.webkit.CookieManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var progressBar: ProgressBar
    private lateinit var errorLayout: View
    private lateinit var btnRetry: Button
    private lateinit var tvErrorMessage: TextView

    companion object {
        const val TARGET_URL = "${websiteUrl.trim()}"
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)
        progressBar = findViewById(R.id.progressBar)
        errorLayout = findViewById(R.id.errorLayout)
        btnRetry = findViewById(R.id.btnRetry)
        tvErrorMessage = findViewById(R.id.tvErrorMessage)

        setupWebViewSettings()
        setupWebViewClients()
        setupSwipeRefresh()
        setupBackNavigation()

        btnRetry.setOnClickListener {
            errorLayout.visibility = View.GONE
            webView.visibility = View.VISIBLE
            loadTargetUrl()
        }

        loadTargetUrl()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebViewSettings() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true
        settings.builtInZoomControls = false
        settings.displayZoomControls = false
        settings.setSupportZoom(false)
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.allowFileAccess = false
        settings.allowContentAccess = true

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)
            settings.mixedContentMode = ${
              allowCleartext
                ? 'WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE'
                : 'WebSettings.MIXED_CONTENT_NEVER_ALLOW'
            }
        }
    }

    private fun setupWebViewClients() {
        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                ${enableProgressBar ? 'progressBar.visibility = View.VISIBLE' : ''}
                errorLayout.visibility = View.GONE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                ${enableProgressBar ? 'progressBar.visibility = View.GONE' : ''}
                ${enablePullToRefresh ? 'swipeRefreshLayout.isRefreshing = false' : ''}
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true) {
                    showError("Unable to load page. Please verify your connection.")
                }
            }

            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url?.toString() ?: return false
                return handleSpecialUrls(url)
            }

            @Deprecated("Deprecated in Java")
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                if (url == null) return false
                return handleSpecialUrls(url)
            }
        }

        ${
          enableProgressBar
            ? `webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                super.onProgressChanged(view, newProgress)
                progressBar.progress = newProgress
                if (newProgress >= 100) {
                    progressBar.visibility = View.GONE
                } else {
                    progressBar.visibility = View.VISIBLE
                }
            }
        }`
            : ''
        }
    }

    private fun handleSpecialUrls(url: String): Boolean {
        val uri = Uri.parse(url)
        val scheme = uri.scheme?.lowercase() ?: ""

        // Handle external protocols safely
        if (scheme == "tel" || scheme == "mailto" || scheme == "sms" || scheme == "whatsapp" || scheme == "market") {
            try {
                val intent = Intent(Intent.ACTION_VIEW, uri)
                startActivity(intent)
                return true
            } catch (e: Exception) {
                return false
            }
        }

        // Keep internal website navigations in WebView
        val targetHost = Uri.parse(TARGET_URL).host
        val currentHost = uri.host

        if (currentHost != null && targetHost != null && (currentHost == targetHost || currentHost.endsWith(".$targetHost"))) {
            return false
        }

        // External websites open in user's default browser
        try {
            val intent = Intent(Intent.ACTION_VIEW, uri)
            startActivity(intent)
            return true
        } catch (e: Exception) {
            return false
        }
    }

    private fun setupSwipeRefresh() {
        ${
          enablePullToRefresh
            ? `swipeRefreshLayout.isEnabled = true
        swipeRefreshLayout.setColorSchemeColors(resources.getColor(R.color.colorPrimary, theme))
        swipeRefreshLayout.setOnRefreshListener {
            loadTargetUrl()
        }`
            : `swipeRefreshLayout.isEnabled = false`
        }
    }

    private fun setupBackNavigation() {
        ${
          enableBackNav
            ? `onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })`
            : ''
        }
    }

    private fun loadTargetUrl() {
        if (!isNetworkAvailable()) {
            showError("No internet connection detected. Please connect and tap Retry.")
            return
        }
        webView.loadUrl(TARGET_URL)
    }

    private fun isNetworkAvailable(): Boolean {
        val connectivityManager =
            getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(network) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    private fun showError(message: String) {
        ${enableProgressBar ? 'progressBar.visibility = View.GONE' : ''}
        ${enablePullToRefresh ? 'swipeRefreshLayout.isRefreshing = false' : ''}
        ${
          enableOfflineScreen
            ? `webView.visibility = View.GONE
        errorLayout.visibility = View.VISIBLE
        tvErrorMessage.text = message`
            : ''
        }
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        super.onPause()
        webView.onPause()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
`
      );

      setGenerationStep('Building layout templates & values...');

      // 10. activity_main.xml
      zip.file(
        'app/src/main/res/layout/activity_main.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/colorBackground">

    <androidx.swiperefreshlayout.widget.SwipeRefreshLayout
        android:id="@+id/swipeRefreshLayout"
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <WebView
            android:id="@+id/webView"
            android:layout_width="match_parent"
            android:layout_height="match_parent" />

    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>

    <ProgressBar
        android:id="@+id/progressBar"
        style="?android:attr/progressBarStyleHorizontal"
        android:layout_width="match_parent"
        android:layout_height="4dp"
        android:indeterminate="false"
        android:max="100"
        android:progressDrawable="@drawable/progress_bar_horizontal"
        android:visibility="gone" />

    <!-- Fallback Offline / Error View -->
    <LinearLayout
        android:id="@+id/errorLayout"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        android:gravity="center"
        android:padding="32dp"
        android:visibility="gone"
        android:background="@color/colorBackground">

        <ImageView
            android:layout_width="72dp"
            android:layout_height="72dp"
            android:src="@drawable/ic_wifi_off"
            app:tint="@color/colorPrimary"
            android:contentDescription="@string/error_title" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/error_title"
            android:textSize="20sp"
            android:textStyle="bold"
            android:textColor="@color/colorTextPrimary"
            android:layout_marginTop="16dp" />

        <TextView
            android:id="@+id/tvErrorMessage"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/error_message"
            android:textSize="14sp"
            android:gravity="center"
            android:textColor="@color/colorTextSecondary"
            android:layout_marginTop="8dp" />

        <Button
            android:id="@+id/btnRetry"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/retry_button"
            android:layout_marginTop="24dp"
            android:backgroundTint="@color/colorPrimary"
            android:textColor="#FFFFFF" />

    </LinearLayout>

</androidx.coordinatorlayout.widget.CoordinatorLayout>
`
      );

      // 11. activity_splash.xml
      zip.file(
        'app/src/main/res/layout/activity_splash.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/splashBackground"
    android:padding="24dp">

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:gravity="center"
        android:orientation="vertical">

        <ImageView
            android:layout_width="96dp"
            android:layout_height="96dp"
            android:src="@mipmap/ic_launcher"
            android:contentDescription="@string/app_name" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/app_name"
            android:textColor="#FFFFFF"
            android:textSize="24sp"
            android:textStyle="bold"
            android:layout_marginTop="20dp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/splash_text"
            android:textColor="#E0E7FF"
            android:textSize="14sp"
            android:layout_marginTop="8dp" />

        <ProgressBar
            android:layout_width="32dp"
            android:layout_height="32dp"
            android:layout_marginTop="32dp"
            android:indeterminateTint="#FFFFFF" />

    </LinearLayout>

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:layout_centerHorizontal="true"
        android:text="Secure Native WebView"
        android:textColor="#A5B4FC"
        android:textSize="12sp"
        android:layout_marginBottom="16dp" />

</RelativeLayout>
`
      );

      // 12. values/colors.xml
      zip.file(
        'app/src/main/res/values/colors.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">${primaryColor}</color>
    <color name="colorPrimaryDark">${primaryDarkHex}</color>
    <color name="colorAccent">${accentHex}</color>
    <color name="splashBackground">${primaryColor}</color>
    <color name="colorBackground">#F8FAFC</color>
    <color name="colorTextPrimary">#0F172A</color>
    <color name="colorTextSecondary">#64748B</color>
</resources>
`
      );

      // 13. values/strings.xml
      zip.file(
        'app/src/main/res/values/strings.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${xmlEscape(appName.trim())}</string>
    <string name="splash_text">${xmlEscape(splashText.trim())}</string>
    <string name="error_title">Connection Error</string>
    <string name="error_message">Please check your internet connection and try again.</string>
    <string name="retry_button">Try Again</string>
</resources>
`
      );

      // 14. values/themes.xml
      zip.file(
        'app/src/main/res/values/themes.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.${safeThemeName}" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryVariant">@color/colorPrimaryDark</item>
        <item name="colorOnPrimary">#FFFFFF</item>
        <item name="android:statusBarColor">@color/colorPrimaryDark</item>
        <item name="android:windowLightStatusBar">false</item>
    </style>

    <style name="Theme.${safeThemeName}.Splash" parent="Theme.${safeThemeName}">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowFullscreen">false</item>
        <item name="android:statusBarColor">@color/splashBackground</item>
        <item name="android:windowLightStatusBar">false</item>
    </style>
</resources>
`
      );

      // 15. drawables
      zip.file(
        'app/src/main/res/drawable/progress_bar_horizontal.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:id="@android:id/background">
        <color android:color="#00000000" />
    </item>
    <item android:id="@android:id/progress">
        <clip>
            <shape>
                <solid android:color="@color/colorAccent" />
            </shape>
        </clip>
    </item>
</layer-list>
`
      );

      zip.file(
        'app/src/main/res/drawable/ic_wifi_off.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FF000000"
        android:pathData="M1,9l2,2c4.97,-4.97 13.03,-4.97 18,0l2,-2C17.03,3.03 6.97,3.03 1,9zM5,13l2,2c2.76,-2.76 7.24,-2.76 10,0l2,-2C15.9,9.9 8.1,9.9 5,13zM9,17l3,3 3,-3c-1.65,-1.66 -4.34,-1.66 -6,0z" />
</vector>
`
      );

      setGenerationStep('Rendering app icon mipmaps for all densities...');

      // 16. Mipmap PNGs (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
      const densities = [
        { name: 'mdpi', size: 48 },
        { name: 'hdpi', size: 72 },
        { name: 'xhdpi', size: 96 },
        { name: 'xxhdpi', size: 144 },
        { name: 'xxxhdpi', size: 192 },
      ];

      for (const d of densities) {
        const squareBlob = await renderIconToBlob(d.size, false);
        const roundBlob = await renderIconToBlob(d.size, true);
        zip.file(`app/src/main/res/mipmap-${d.name}/ic_launcher.png`, squareBlob);
        zip.file(`app/src/main/res/mipmap-${d.name}/ic_launcher_round.png`, roundBlob);
      }

      setGenerationStep('Packaging Android Studio guide & README...');

      // 17. README.md
      const readmeContent = `# ${appName} — Android Studio Project

Generated by **Toolio Website to Android App Converter**.

This archive contains the **complete native Android Studio Kotlin source code project** for **${appName}**, wrapping \`${websiteUrl}\` in a high-performance, secure Android WebView.

---

## 📌 Important Build & Compilation Notice
> **Notice**: Toolio generates **100% complete native source code** ready to compile in Android Studio. In-browser tools cannot sign, compile, or build binary APKs or Play Store App Bundles (AABs). Follow the simple steps below to generate your APK or AAB in Android Studio within minutes!

---

## 🚀 Quick Start: How to Open & Build in Android Studio

### Prerequisites
- **Android Studio** (Koala, Jellyfish, Iguana, Hedgehog or newer)
- **JDK 17** (installed and managed automatically by modern Android Studio)
- **Android SDK API 34** (installed via Android Studio SDK Manager)

### Step 1: Extract the Project
Extract the contents of this ZIP file into a folder on your computer (e.g. \`~/AndroidProjects/${rootDirName}\`).

### Step 2: Open in Android Studio
1. Launch **Android Studio**.
2. Click **Open** (or **File > Open**).
3. Browse to and select the extracted project folder.
4. Wait for Gradle to finish syncing the dependencies (this takes 1–2 minutes on first run as it caches AndroidX libraries).

### Step 3: Run on Emulator or USB Device
1. Connect an Android phone with **USB Debugging** enabled, or start an Android Virtual Device (AVD) from **Device Manager**.
2. Click the green **Run ▶** button in the top toolbar (or press \`Shift + F10\`).
3. The app will build, install, display your splash screen, and load **${websiteUrl}**.

---

## 📦 How to Build the Shareable APK

### Debug APK (For Testing & Sideloading)
1. In Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. Once the build finishes, a notification will appear: \`APK(s) generated successfully\`.
3. Click **locate** to find \`app-debug.apk\` in \`app/build/outputs/apk/debug/\`.
4. You can send this APK to your Android device to test immediately!

### Release APK or Google Play Store Bundle (.AAB)
1. In Android Studio, go to **Build > Generate Signed Bundle / APK**.
2. Select **Android App Bundle** (for Google Play) or **APK** (for direct distribution).
3. Create a new keystore or select an existing one.
4. Select the **release** build variant and click **Finish**.
5. Your signed bundle will be created in \`app/release/\`.

---

## 🛡️ Security, Permissions & Best Practices

### Permissions Included:
- \`android.permission.INTERNET\`: Essential for WebView network traffic.
- \`android.permission.ACCESS_NETWORK_STATE\`: Detects whether the device has an active Wi-Fi or cellular connection to display the native offline retry card.

### Why No Unrestricted Permissions?
To protect end-user privacy and prevent Google Play Store compliance rejections, this project **does not include** sensitive native permissions (such as background location, camera, audio recording, contacts, or storage).

### Need Device Native Capabilities?
- **File Uploads / Photos**: Standard HTML \`<input type="file">\` elements work via the default Android system file picker without requiring special camera permissions.
- **Geolocation**: If your website requires HTML5 Geolocation, add \`ACCESS_FINE_LOCATION\` to \`AndroidManifest.xml\` and implement \`onGeolocationPermissionsShowPrompt\` in \`WebChromeClient\`.
- **Push Notifications, Bluetooth, or Biometrics**: WebViews cannot natively invoke low-level Bluetooth or background push without native Kotlin code or an SDK like Firebase Cloud Messaging (FCM).

---

## ⚙️ Project Specifications
- **Application ID / Package**: \`${packageId}\`
- **Version**: \`${versionName}\` (Code: \`${versionCode}\`)
- **Target SDK**: \`34\` (Android 14)
- **Minimum SDK**: \`24\` (Android 7.0 Nougat — 97%+ worldwide device coverage)
- **Programming Language**: Kotlin 1.9.23
- **Build System**: Gradle 8.7 with Kotlin DSL (\`*.gradle.kts\`)
- **Target URL**: \`${websiteUrl}\`
- **Theme Color**: \`${primaryColor}\`

Generated with ❤️ by [Toolio](https://toolio.pages.dev)
`;
      zip.file('README.md', readmeContent);

      setGenerationStep('Compressing final ZIP archive...');

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      // Trigger browser download via smart download manager
      await downloadBlob(zipBlob, `${rootDirName}-Android-Studio-Project.zip`, 'website-to-android-app-converter');

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setGenerationStep('');
      setIsGenerating(false);
    } catch (err) {
      console.error('Error generating ZIP:', err);
      alert('An error occurred while generating the ZIP archive. Please try again.');
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 min-w-0">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Native Android Kotlin Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Website to Android App Converter
            </h1>
            <p className="text-violet-100 text-sm sm:text-base leading-relaxed">
              Convert any responsive website or web app into a clean, complete Android Studio Kotlin project. Includes native splash screen, pull-to-refresh, offline retry states, and hardware back navigation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleGenerateZip}
              disabled={!isValid || isGenerating}
              className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-all transform active:scale-95 ${
                isValid && !isGenerating
                  ? 'bg-white text-indigo-700 hover:bg-violet-50 hover:shadow-xl'
                  : 'bg-white/40 text-white/80 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Packaging ZIP...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download Android Project (.ZIP)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Technical Notice Banner */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-violet-100 gap-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Generates complete Android Studio Kotlin source code (.zip) ready to compile.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>100% Client-Side Processing • Zero Server Uploads</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Inputs + Live Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-w-0">
        {/* Left Column: Configuration Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-6 min-w-0">
          {/* Card 1: Core App Parameters */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Application Parameters
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure your website URL, package name, and branding
                </p>
              </div>
            </div>

            {/* Website URL */}
            <div className="space-y-1.5">
              <label htmlFor={urlInputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Website URL <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  id={urlInputId}
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => {
                    setWebsiteUrl(e.target.value);
                    setIsIframeBlocked(false);
                  }}
                  placeholder="https://example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    urlError
                      ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-violet-500'
                  }`}
                />
              </div>
              {urlError ? (
                <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{urlError}</span>
                </p>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Target URL loaded inside the Android WebView. HTTPS recommended.
                </p>
              )}
            </div>

            {/* App Name & Version */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 min-w-0">
                <label htmlFor={appNameInputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Android App Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id={appNameInputId}
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="My Web App"
                  maxLength={50}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    appNameError
                      ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-violet-500'
                  }`}
                />
                {appNameError && (
                  <p className="text-xs text-rose-500 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{appNameError}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between">
                  <label htmlFor={versionNameInputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Version Name & Code
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    id={versionNameInputId}
                    type="text"
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                    placeholder="1.0.0"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <input
                    id={versionCodeInputId}
                    type="number"
                    min={1}
                    value={versionCode}
                    onChange={(e) => setVersionCode(parseInt(e.target.value, 10) || 1)}
                    placeholder="1"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>

            {/* Package ID with Auto-generate helper */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor={packageInputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Android Package ID (Application ID) <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoGeneratePackageId}
                  className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-Generate</span>
                </button>
              </div>
              <input
                id={packageInputId}
                type="text"
                value={packageId}
                onChange={(e) => setPackageId(e.target.value.toLowerCase())}
                placeholder="com.example.mywebapp"
                className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                  packageError
                    ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-violet-500'
                }`}
              />
              {packageError ? (
                <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{packageError}</span>
                </p>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Unique package identifier for Google Play Store (e.g. <code className="text-slate-600 dark:text-slate-300">com.company.app</code>).
                </p>
              )}
            </div>

            {/* Primary Theme Color */}
            <div className="space-y-2">
              <label htmlFor={primaryColorInputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Primary Brand Color
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80">
                  <input
                    id={primaryColorInputId}
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">
                    {primaryColor}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      title={preset.name}
                      onClick={() => setPrimaryColor(preset.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform transform hover:scale-110 ${
                        primaryColor.toLowerCase() === preset.hex.toLowerCase()
                          ? 'border-slate-900 dark:border-white scale-110 shadow-sm'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: preset.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Splash Screen Text & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2 space-y-1.5 min-w-0">
                <label htmlFor={splashTextInputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Splash Screen Subtitle / Tagline
                </label>
                <input
                  id={splashTextInputId}
                  type="text"
                  value={splashText}
                  onChange={(e) => setSplashText(e.target.value)}
                  placeholder="Welcome to My Web App"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label htmlFor={splashDurationInputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Splash Delay
                </label>
                <select
                  id={splashDurationInputId}
                  value={splashDuration}
                  onChange={(e) => setSplashDuration(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value={1000}>1.0 Second</option>
                  <option value={1500}>1.5 Seconds</option>
                  <option value={2000}>2.0 Seconds</option>
                  <option value={3000}>3.0 Seconds</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: App Icon Upload & Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Android App Icon
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload custom launcher artwork or use our auto-styled vector generator
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:flex-1 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/60 dark:bg-slate-800/40"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleIconUpload(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-12 h-12 mx-auto rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {iconFileName ? iconFileName : 'Click or drag & drop app icon'}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  PNG, JPG, SVG, or WebP (min. 512×512 recommended)
                </p>
                {iconDataUrl && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIconDataUrl(null);
                      setIconFileName(null);
                    }}
                    className="mt-3 text-xs text-rose-500 hover:underline font-semibold"
                  >
                    Reset to Default Icon
                  </button>
                )}
              </div>

              {/* Icon Preview Badges */}
              <div className="flex sm:flex-col items-center gap-4 text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-16 h-16 rounded-2xl shadow-md overflow-hidden flex items-center justify-center text-white font-extrabold text-2xl border border-white/20"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {iconDataUrl ? (
                      <img src={iconDataUrl} alt="App icon" className="w-full h-full object-cover" />
                    ) : (
                      <span>{appName.trim().slice(0, 2).toUpperCase() || 'W'}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Adaptive Square
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-16 h-16 rounded-full shadow-md overflow-hidden flex items-center justify-center text-white font-extrabold text-2xl border border-white/20"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {iconDataUrl ? (
                      <img src={iconDataUrl} alt="App icon" className="w-full h-full object-cover" />
                    ) : (
                      <span>{appName.trim().slice(0, 2).toUpperCase() || 'W'}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Circular Icon
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Advanced WebView Capabilities */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  WebView Features & Navigation
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Toggle native Android integrations and fallback experiences
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={enablePullToRefresh}
                  onChange={(e) => setEnablePullToRefresh(e.target.checked)}
                  className="mt-0.5 rounded text-violet-600 focus:ring-violet-500 w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Pull-to-Refresh (SwipeRefreshLayout)
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Allows users to swipe down anywhere to instantly reload the webpage.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={enableProgressBar}
                  onChange={(e) => setEnableProgressBar(e.target.checked)}
                  className="mt-0.5 rounded text-violet-600 focus:ring-violet-500 w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Top Loading Progress Bar
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Displays a smooth horizontal loading bar colored with your primary brand color while pages load.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={enableBackNav}
                  onChange={(e) => setEnableBackNav(e.target.checked)}
                  className="mt-0.5 rounded text-violet-600 focus:ring-violet-500 w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Hardware Back Button Handling
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Pressing Android's back button navigates backwards through web history before exiting the app.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={enableOfflineScreen}
                  onChange={(e) => setEnableOfflineScreen(e.target.checked)}
                  className="mt-0.5 rounded text-violet-600 focus:ring-violet-500 w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Offline & Error Retry Screen
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Shows a branded native offline card with "Retry Connection" button instead of a broken browser error.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={allowCleartext}
                  onChange={(e) => setAllowCleartext(e.target.checked)}
                  className="mt-0.5 rounded text-violet-600 focus:ring-violet-500 w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>Allow Unencrypted HTTP Traffic</span>
                    {allowCleartext && (
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded">
                        Not Recommended
                      </span>
                    )}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Permits non-HTTPS URLs. Keep unchecked for modern Google Play Store security compliance.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Live Mobile Phone Mockup (5 cols) */}
        <div className="lg:col-span-5 space-y-6 min-w-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-violet-600" />
                  <span>Interactive Android Preview</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Live simulation of the native app experience
                </p>
              </div>

              {/* Preview Mode Selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPreviewTab('live')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    previewTab === 'live'
                      ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Web
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('splash')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    previewTab === 'splash'
                      ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Splash
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('offline')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    previewTab === 'offline'
                      ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Offline
                </button>
              </div>
            </div>

            {/* Smartphone Hardware Frame */}
            <div className="relative mx-auto w-full max-w-[320px] aspect-[9/18.5] bg-slate-950 rounded-[44px] p-3 shadow-2xl ring-1 ring-slate-800 flex flex-col overflow-hidden">
              {/* Screen Bezel & Camera Notch */}
              <div className="relative w-full h-full bg-slate-900 rounded-[34px] overflow-hidden flex flex-col">
                {/* Android Status Bar */}
                <div
                  className="w-full px-5 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-white select-none transition-colors"
                  style={{
                    backgroundColor:
                      previewTab === 'splash' ? primaryColor : adjustColorBrightness(primaryColor, -25),
                  }}
                >
                  <span>9:41</span>
                  {/* Camera hole punch */}
                  <div className="w-3.5 h-3.5 rounded-full bg-black/80 ring-1 ring-white/10" />
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <Wifi className="w-3 h-3" />
                    <span>5G</span>
                    <div className="w-4 h-2 rounded-xs border border-white flex items-center p-0.5">
                      <div className="w-full h-full bg-white rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* Optional Top Progress Bar */}
                {enableProgressBar && previewTab === 'live' && (
                  <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full w-2/3 animate-pulse"
                      style={{ backgroundColor: primaryColor }}
                    />
                  </div>
                )}

                {/* Screen Content Viewport */}
                <div className="flex-1 w-full relative overflow-hidden bg-slate-50 dark:bg-slate-950">
                  {/* Tab 1: Live Web Preview */}
                  {previewTab === 'live' && (
                    <div className="w-full h-full flex flex-col">
                      {isIframeBlocked || !websiteUrl.startsWith('http') ? (
                        /* Graceful Simulated Web Screen */
                        <div className="flex-1 p-4 flex flex-col justify-between bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-200">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700">
                              <Globe className="w-4 h-4 text-violet-500 shrink-0" />
                              <span className="text-xs font-mono truncate text-slate-600 dark:text-slate-300">
                                {websiteUrl}
                              </span>
                            </div>

                            <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 shadow-xs space-y-2 text-center">
                              <div
                                className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                                style={{ backgroundColor: primaryColor }}
                              >
                                {iconDataUrl ? (
                                  <img src={iconDataUrl} alt="icon" className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                  appName.slice(0, 2).toUpperCase()
                                )}
                              </div>
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                {appName}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Ready for Android WebView packaging
                              </p>
                            </div>

                            <div className="space-y-1.5 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-900 dark:text-violet-200 text-xs">
                              <p className="font-semibold flex items-center gap-1 text-[11px]">
                                <Info className="w-3 h-3 text-violet-600 shrink-0" />
                                <span>Iframe security restriction notice</span>
                              </p>
                              <p className="text-[11px] text-violet-700 dark:text-violet-300">
                                Some external websites block iframe embedding using HTTP X-Frame-Options. In the native Android app, your website will load directly without restriction!
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 text-center">
                            <a
                              href={websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 hover:underline font-semibold"
                            >
                              <span>Open URL in new tab</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <iframe
                          key={previewKey}
                          src={websiteUrl}
                          title="Android WebView Preview"
                          className="w-full h-full border-0"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                          onError={() => setIsIframeBlocked(true)}
                        />
                      )}
                    </div>
                  )}

                  {/* Tab 2: Splash Screen Simulation */}
                  {previewTab === 'splash' && (
                    <div
                      className="w-full h-full flex flex-col items-center justify-between p-6 text-white text-center select-none"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 rounded-2xl shadow-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl font-extrabold">
                          {iconDataUrl ? (
                            <img src={iconDataUrl} alt="icon" className="w-full h-full object-cover" />
                          ) : (
                            <span>{appName.trim().slice(0, 2).toUpperCase() || 'W'}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold tracking-tight">{appName}</h4>
                          <p className="text-xs text-white/80 mt-1">{splashText}</p>
                        </div>
                        <div className="pt-2">
                          <RefreshCw className="w-5 h-5 animate-spin text-white/90" />
                        </div>
                      </div>

                      <div className="text-[10px] text-white/70">
                        Secure Android WebView
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Offline Retry State Simulation */}
                  {previewTab === 'offline' && (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-900 select-none">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white shadow-md"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <WifiOff className="w-8 h-8" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Connection Error
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
                        Please check your internet connection and try again.
                      </p>
                      <button
                        type="button"
                        onClick={() => setPreviewTab('live')}
                        className="mt-5 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-transform transform active:scale-95"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>

                {/* Android System Navigation Bar (Pill) */}
                <div className="w-full h-5 bg-slate-950 flex items-center justify-center">
                  <div className="w-24 h-1 rounded-full bg-slate-600" />
                </div>
              </div>
            </div>

            {/* Quick Action in Card */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
              <button
                type="button"
                onClick={handleGenerateZip}
                disabled={!isValid || isGenerating}
                className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  isValid && !isGenerating
                    ? 'bg-violet-600 hover:bg-violet-700 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{generationStep || 'Generating Project...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Project ZIP</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Generates complete Android Studio Kotlin project ready to compile into an APK.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Step-by-Step Android Studio Documentation Accordion / Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-violet-600" />
              <span>Android Studio Build & Publish Guide</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Complete instructions to open, build, test, and release your app
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveGuideTab('studio')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeGuideTab === 'studio'
                  ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              1. Open in Studio
            </button>
            <button
              type="button"
              onClick={() => setActiveGuideTab('run')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeGuideTab === 'run'
                  ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              2. Test on Phone
            </button>
            <button
              type="button"
              onClick={() => setActiveGuideTab('apk')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeGuideTab === 'apk'
                  ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              3. Build APK / AAB
            </button>
            <button
              type="button"
              onClick={() => setActiveGuideTab('security')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeGuideTab === 'security'
                  ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              4. Permissions & Native
            </button>
          </div>
        </div>

        {/* Tab 1: Open in Android Studio */}
        {activeGuideTab === 'studio' && (
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white">Extract Archive</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Extract the downloaded <code className="text-violet-600 dark:text-violet-400">.zip</code> into a convenient directory on your machine.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white">Open Project</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  In Android Studio, click <strong>Open</strong> and choose the extracted root folder (where <code className="text-violet-600 dark:text-violet-400">settings.gradle.kts</code> is located).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white">Automatic Gradle Sync</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Android Studio will download the Gradle 8.7 wrapper and AndroidX dependencies automatically.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/60 flex items-start gap-3">
              <Info className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <strong className="text-violet-950 dark:text-violet-200 block">
                  Why is Android Studio recommended?
                </strong>
                <p className="text-violet-800 dark:text-violet-300">
                  Android Studio provides Google's official Android SDK, AAPT2 asset compiler, and code-signing tools required by the Google Play Store. Compiling in Android Studio ensures your APK is optimized, signed, and complies with Android 14 (API 34) standards.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Test on Phone */}
        {activeGuideTab === 'run' && (
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-violet-600" />
                  <span>Option A: Physical Android Phone</span>
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pl-1">
                  <li>Go to <strong>Settings &gt; About Phone</strong> on your device.</li>
                  <li>Tap <strong>Build Number</strong> 7 times to enable Developer Options.</li>
                  <li>In Developer Options, turn on <strong>USB Debugging</strong>.</li>
                  <li>Connect your phone via USB cable and allow the prompt.</li>
                  <li>Click the green <strong>Run ▶</strong> button in Android Studio toolbar.</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-violet-600" />
                  <span>Option B: Android Virtual Device (AVD)</span>
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pl-1">
                  <li>Open <strong>Tools &gt; Device Manager</strong> in Android Studio.</li>
                  <li>Click <strong>Create Device</strong> and select Pixel 8 or any device.</li>
                  <li>Choose system image <strong>API 34 (UpsideDownCake)</strong>.</li>
                  <li>Start the virtual device.</li>
                  <li>Click the green <strong>Run ▶</strong> button to deploy!</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Build APK / AAB */}
        {activeGuideTab === 'apk' && (
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Build Debug APK (For Sideloading)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ideal for sending directly to testers, colleagues, or clients via WhatsApp/Email.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs flex items-center justify-between">
                  <span>./gradlew assembleDebug</span>
                  <button
                    type="button"
                    onClick={() => copyCode('./gradlew assembleDebug', 'gradleDebug')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedSnippet === 'gradleDebug' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Output path: <code className="text-violet-600 dark:text-violet-400">app/build/outputs/apk/debug/app-debug.apk</code>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Build Google Play Bundle (.AAB)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Required format for publishing to the Google Play Store Console.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs flex items-center justify-between">
                  <span>./gradlew bundleRelease</span>
                  <button
                    type="button"
                    onClick={() => copyCode('./gradlew bundleRelease', 'gradleRelease')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedSnippet === 'gradleRelease' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Menu: <strong>Build &gt; Generate Signed Bundle / APK &gt; Android App Bundle</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Security & Permissions FAQ */}
        {activeGuideTab === 'security' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Security First: Why Arbitrary Permissions Are Omitted</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Google Play Store policies strictly penalize applications that declare permissions they do not use (e.g. background location, camera, microphone, contacts, or SMS). The generated project includes only:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-2">
                <li><code className="text-violet-600 dark:text-violet-400">android.permission.INTERNET</code>: Needed to fetch and render your web pages.</li>
                <li><code className="text-violet-600 dark:text-violet-400">android.permission.ACCESS_NETWORK_STATE</code>: Used to display the offline recovery screen when network connectivity is lost.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
              <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Websites Requiring Special Native Hardware Features</span>
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                If your website relies on native hardware APIs such as <strong>Bluetooth Low Energy (BLE)</strong>, <strong>NFC readers</strong>, <strong>Biometric Fingerprint Authentication</strong>, or <strong>Background Geofencing</strong>, standard mobile WebViews cannot bridge these calls out of the box. You will need to add Kotlin JavascriptInterface methods or use native plugins. Standard HTML5 camera file pickers, audio playback, and location prompts work cleanly!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

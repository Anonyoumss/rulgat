import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

void main() => runApp(const RulGATApp());

class RulGATApp extends StatelessWidget {
  const RulGATApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'كويز بوكس — QuizBox',
      debugShowCheckedModeBanner: false,
      locale: const Locale('ar'),
      supportedLocales: const [Locale('ar'), Locale('en')],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF1CB0F6),
        brightness: Brightness.light,
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF46CBE3),
        brightness: Brightness.dark,
      ),
      home: const HomeShell(),
    );
  }
}

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});
  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _tab = 0;
  static const _titles = ['الرئيسية', 'المنهج', 'تِجْر', 'محاكاة', 'ملفي'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_titles[_tab])),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('🐯', style: TextStyle(fontSize: 64)),
            const SizedBox(height: 12),
            Text('TIGDR — ${_titles[_tab]}',
                style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 8),
            Text('Flutter client scaffold — mirrors web app',
                style: Theme.of(context).textTheme.bodySmall),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), label: 'الرئيسية'),
          NavigationDestination(icon: Icon(Icons.menu_book_outlined), label: 'المنهج'),
          NavigationDestination(icon: Icon(Icons.water_drop_outlined), label: 'تِجْر'),
          NavigationDestination(icon: Icon(Icons.quiz_outlined), label: 'محاكاة'),
          NavigationDestination(icon: Icon(Icons.person_outline), label: 'ملفي'),
        ],
      ),
    );
  }
}

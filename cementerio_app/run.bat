@echo off
cd /d c:\Users\DANIEL\Cementerio\cementerio_app
echo Iniciando compilación de Flutter...
echo.
flutter clean
flutter pub get
echo.
echo Compilando para Android...
flutter run -d emulator-5554
pause

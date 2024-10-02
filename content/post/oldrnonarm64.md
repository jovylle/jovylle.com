---
title: Old React Native Version on Arm64 machines
date: 2024-10-02T18:31:00.000Z
---
# Old React Native Version on Arm64 machines 



On Ubuntu Arm64

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dvcy5nt2rkixiw8ocyq4.jpg)

```
utm@utmjov:~/Foremost/AsDeveloper/Projects/reactnative0615$ npx react-native run-android
info Running jetifier to migrate libraries to AndroidX. You can disable it using "--no-jetifier" flag.
Jetifier found 866 file(s) to forward-jetify. Using 2 workers...
info JS server already running.
x86_64-binfmt-P: Could not open '/lib64/ld-linux-x86-64.so.2': No such file or directory
info Launching emulator...
error Failed to launch emulator. Reason: No emulators found as an output of `emulator -list-avds`.
warn Please launch an emulator manually or connect a device. Otherwise app may fail to launch.
info Installing the app...
:ReactNative:Unexpected empty result of running '[node, -e, console.log(require('react-native/cli').bin);]' command.
:ReactNative:Running '[node, -e, console.log(require('react-native/cli').bin);]' command failed.

FAILURE: Build failed with an exception.

* Where:
Script '/home/utm/Foremost/AsDeveloper/Projects/reactnative0615/node_modules/@react-native-community/cli-platform-android/native_modules.gradle' line: 170

* What went wrong:
A problem occurred evaluating script.
> internal/modules/cjs/loader.js:934  throw err;  ^Error: Cannot find module 'react-native/cli'Require stack:- /home/utm/.gradle/daemon/5.5/[eval]    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:931:15)    at Function.Module._load (internal/modules/cjs/loader.js:774:27)    at Module.require (internal/modules/cjs/loader.js:1003:19)    at require (internal/modules/cjs/helpers.js:107:18)    at [eval]:1:13    at Script.runInThisContext (vm.js:134:12)    at Object.runInThisContext (vm.js:310:38)    at internal/process/execution.js:81:19    at [eval]-wrapper:6:22    at evalScript (internal/process/execution.js:80:60) {  code: 'MODULE_NOT_FOUND',  requireStack: [ '/home/utm/.gradle/daemon/5.5/[eval]' ]}

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 461ms

error Failed to install the app. Make sure you have the Android development environment set up: https://facebook.github.io/react-native/docs/getting-started.html#android-development-environment. Run CLI with --verbose flag for more details.
Error: Command failed: ./gradlew app:installDebug -PreactNativeDevServerPort=8081
:ReactNative:Unexpected empty result of running '[node, -e, console.log(require('react-native/cli').bin);]' command.
:ReactNative:Running '[node, -e, console.log(require('react-native/cli').bin);]' command failed.

FAILURE: Build failed with an exception.

* Where:
Script '/home/utm/Foremost/AsDeveloper/Projects/reactnative0615/node_modules/@react-native-community/cli-platform-android/native_modules.gradle' line: 170

* What went wrong:
A problem occurred evaluating script.
> internal/modules/cjs/loader.js:934  throw err;  ^Error: Cannot find module 'react-native/cli'Require stack:- /home/utm/.gradle/daemon/5.5/[eval]    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:931:15)    at Function.Module._load (internal/modules/cjs/loader.js:774:27)    at Module.require (internal/modules/cjs/loader.js:1003:19)    at require (internal/modules/cjs/helpers.js:107:18)    at [eval]:1:13    at Script.runInThisContext (vm.js:134:12)    at Object.runInThisContext (vm.js:310:38)    at internal/process/execution.js:81:19    at [eval]-wrapper:6:22    at evalScript (internal/process/execution.js:80:60) {  code: 'MODULE_NOT_FOUND',  requireStack: [ '/home/utm/.gradle/daemon/5.5/[eval]' ]}

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 461ms

    at checkExecSyncError (child_process.js:790:11)
    at execFileSync (child_process.js:827:15)
    at runOnAllDevices (/home/utm/Foremost/AsDeveloper/Projects/reactnative0615/node_modules/@react-native-community/cli-platform-android/build/commands/runAndroid/runOnAllDevices.js:94:39)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)

```

and Mac M1 Arm64
```
Error: Command failed: ./gradlew app:installDebug -PreactNativeDevServerPort=8081
:ReactNative:Unexpected empty result of running '[node, -e, console.log(require('react-native/cli').bin);]' command.
:ReactNative:Running '[node, -e, console.log(require('react-native/cli').bin);]' command failed.

FAILURE: Build failed with an exception.

* Where:
Script '/Users/jovylle/projectname/node_modules/@react-native-community/cli-platform-android/native_modules.gradle' line: 170

* What went wrong:
A problem occurred evaluating script.
> internal/modules/cjs/loader.js:934  throw err;  ^Error: Cannot find module 'react-native/cli'Require stack:- /Users/jovylle/.gradle/daemon/6.4.1/[eval]    
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dgokgh2deynvpc9sik41.png)


Currently can't find to make this work on this device, but for me to be able to continue is to 
- use another low end device and SSH it to my main workstation to run commands
- and mount or share folder it to my main workstation to open it in VScode to continue development

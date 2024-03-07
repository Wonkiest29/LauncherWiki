# Installation of LaunchServer

## Choosing a Hosting Provider

To run LaunchServer, you need a **virtual (VDS/VPS)** or **dedicated** server running a Linux distribution (for local testing, use [WSL](https://learn.microsoft.com/ru-ru/windows/wsl/install)). Additionally, ensure the following:

- One of the following up-to-date distributions: **Ubuntu 22.04**, **Debian 12**, **CentOS 8**, **ArchLinux**, and others.
- A web server, such as **Nginx**, for serving static content.
- At least **300MB of free RAM** for LaunchServer to operate.
- When building LaunchServer from source directly on the machine, you may need up to 1 GB of free RAM for Gradle to work.
::: danger Note:
- LaunchServer operates flawlessly ONLY ON **LINUX**; no support will be provided for running it on **Windows** when resolving any issues!
  - Modules like MirrorHelper do not work with **Windows** paths.
  - There will be issues with port openings if connections to **LaunchServer** suddenly become numerous.
  - Almost all commands in the Wiki are provided exclusively for **Linux** systems.
:::

*Optional:*

- A website, CMS, or a personal account with a supported hashing algorithm.
- A database, either **MySQL/MariaDB** or **PostgreSQL**.

*Recommendations:*

- Avoid hosting the site on shared hosting, as it may lead to problems with database connectivity, performance, and stability.
- Hostings providing VDS/VPS based on OpenVZ virtualization may restrict the use of certain programs and limit CPU usage above a certain level for an extended period.
- Older distribution versions may contain vulnerabilities or outdated software versions with many bugs. In such cases, it is recommended to upgrade to the latest version or switch to a different hosting provider.

The installation guide for Windows is no longer available; however, you can use [WSL](https://learn.microsoft.com/ru-ru/windows/wsl/install) for testing and debugging purposes.

# Hosting Configuration

- The first step is to prepare the environment:
  - Install JDK FULL
  - Create a user for LaunchServer

- Strongly recommended:
  - Set up proxying through Nginx with a subdomain.
  - Install an SSL certificate on the subdomain.


### Installing JDK 21

To run LaunchServer, Java 21 is required. It is also suitable for running Minecraft servers version 1.18 and above. For Minecraft server version 1.17.x, Java 16 is required. For Minecraft server version 1.16.5 and below, Java 8 is needed. Install all of them if you plan to keep LaunchServer and servers on the same machine.
:::::: code-group
::::: code-group-item DEBIAN / UBUNTU
::: tip Copy and paste the following commands entirely
```bash:no-line-numbers
sudo apt-get update ;
sudo apt-get install gnupg2 wget apt-transport-https unzip -y ;
sudo mkdir -p /etc/apt/keyrings ;
sudo wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | sudo tee /etc/apt/keyrings/adoptium.asc ;
echo "deb [signed-by=/etc/apt/keyrings/adoptium.asc] https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | sudo tee /etc/apt/sources.list.d/adoptium.list ;
sudo apt-get update ;
sudo apt-get install temurin-21-jdk ;
wget https://download2.gluonhq.com/openjfx/21/openjfx-21_linux-x64_bin-jmods.zip ;
unzip openjfx-21_linux-x64_bin-jmods.zip ;
sudo cp javafx-jmods-21/* /usr/lib/jvm/temurin-21-jdk-amd64/jmods ;
rm -r javafx-jmods-21s
:::
::: warning Note:
In case of the following error:

```sh
java.lang.UnsatisfiedLinkError: /usr/lib/jvm/temurin-21-jdk-amd64/lib/libfontmanager.so: libfreetype.so: cannot open shared object file: No such file or directory
        at java.base/jdk.internal.loader.NativeLibraries.load(Native Method)
```
Install the necessary library:
```sh:no-line-numbers
sudo apt-get libfreetype-dev
```
- This error usually occurs on Ubuntu 22.04. 22.04
:::
::: tip Changing the Default Java
```bash
sudo update-alternatives --config java
sudo update-alternatives --config javac
```
:::

:::::
::::: code-group-item CENTOS
::: tip Add the Adoptium repository and install
```bash:no-line-numbers
cat <<EOF > /etc/yum.repos.d/adoptium.repo
[Adoptium]
name=Adoptium
baseurl=https://packages.adoptium.net/artifactory/rpm/rhel/\$releasever/\$basearch
enabled=1
gpgcheck=1
gpgkey=https://packages.adoptium.net/artifactory/api/gpg/key/public
EOF
```
```bash
dnf update
dnf install temurin-21-jdk
wget https://download2.gluonhq.com/openjfx/21/openjfx-21_linux-x64_bin-jmods.zip ;
unzip openjfx-21_linux-x64_bin-jmods.zip ;
sudo cp javafx-jmods-21/* /usr/lib/jvm/temurin-21-jdk/jmods ;
alternatives --config java
alternatives --config javac
```
:::
:::: tip Changing the Default Java
```bash:no-line-numbers
sudo alternatives --config java
sudo alternatives --config javac
```
::::
:::::
::::: code-group-item WINDOWS
::: tip Open PowerShell (Run as Administrator)
- Install the package **Adoptium JDK 21** using **winget**
```bash:no-line-numbers
winget install EclipseAdoptium.Temurin.21.JDK
```
- Open the [OpenJFX website](https://gluonhq.com/products/javafx/) and download the latest version of **SDK** and **jmods** for Java 21.
- Extract the jmod files from the **jmods** archive to `C:\Program Files\Eclipse Adoptium\YOUR_JDK\jmods`.
- Extract the files from the *SDK* archive (inside there will be a folder with the version name, extract its contents, not the folder itself) to `C:\Program Files\Eclipse Adoptium\YOUR_JDK\`.

:::
:::::
::::: code-group-item OTHER
::: tip Installation for other systems
Visit the JDK [Adoptium](https://adoptium.net/) and [OpenJFX](https://gluonhq.com/products/javafx/)
:::
:::::
::::::

::: warning Note:
- Architectures such as **arm64** and **armhf** do not support the compilation of the EXE launcher binary through launch4j.
---
- If your architecture is **amd64** or **i386**, enable the EXE compilation in the `LaunchServer.json` configuration:
  - launch4j:
    - enabled: true
:::

### Creating the launcher user

Create the **launcher** user:
(Relevant for Ubuntu, Debian, CentOS, ArchLinux)
```bash:no-line-numbers
sudo useradd -m -s /bin/bash launcher
```
:::: details Instructions for working with su:
::: tip Execute commands as the launcher user and navigate to the home folder:
```bash:no-line-numbers
su - launcher
```
:::
::: tip Executing commands as the launcher user without changing the directory:
```bash:no-line-numbers
su launcher
```
:::
::: tip Exit back to root:
```bash:no-line-numbers
exit
```
:::
::::

## Install LaunchServer

Go to user **launcher**:

```bash:no-line-numbers
su - launcher
```
Perform installation of **LaunchServer**'a with a script:

```bash:no-line-numbers
wget -O - https://mirror.gravitlauncher.com/scripts/setup-master.sh | bash <(cat) </dev/tty
```
**After installation is complete, run LaunchServer for initial setup:**
```bash:no-line-numbers
./start.sh
```
- Specify your DOMAIN or IP on which the Launcher Server will run
- Specify the name of your project, which will be displayed in the Launcher and in the AppData folder.
- After the first launch, close the Launcher Server with the command **stop**

```bash:no-line-numbers
stop
```
:::: details Description of folders and files installed by the script
::: tip List of SRC and git folders:
- **src/** - source code of LaunchServer, API, modules, Launcher
- **srcRuntime/** - source code of the graphical part of the Launcher (rantime)
- **compat/** - additional important files: authorisation library, ServerWrapper, modules for Launcher and LaunchServer, etc.
:::
::: tip The installer also builds all modules, ready modules can be found by paths:
- **src/modules/<Module_name>_module/build/libs/<Module_name>_module.jar** - built module for LaunchServer.
- **src/modules/<Module_name>_lmodule/build/libs/<Module_name>_lmodule.jar** - built module for Launcher.
:::
::: tip Ready scripts created by the installer:
- **./start.sh** - start LaunchServer for testing and initial setup
- **./startscreen.sh** - run LaunchServer permanently using the screen utility. Do not run two LaunchServers at the same time!
- **./update.sh** - updates LunchServer, Launcher and Rantime to the latest release version
:::
::: tip List of LaunchServer folders:
- **libraries/** - libraries for LaunchServer
- **modules/** - modules for LaunchServer (ending with _module.jar)
- **profiles/** - folder of profiles to run Minecraft
- **updates/** - update folder
- **logs/** - LunchServer logs folder
- **runtime/** - Launcher design folder
- **launcher-modules/** - modules for Launcher (ending with _lmodule.jar)
- **launcher-libraries/** - libraries for Launcher
- **launcher-compile-libraries/** - auxiliary libraries for Launcher
- **launcher-pack** - files that will be included in the Launcher jar without changes
- **config/** - module configuration settings
- **proguard/** - Proguard settings (code obfuscation)
- **guard/** - native protection (no protection by default)
:::
::::

### Configuring Nginx

Nginx needs to be configured for optimal file upload performance

- Visit the site [\[NGINX\]](https://nginx.org/ru/linux_packages.html) and install Nginx according to your system

- Create in your domain namespace **A** an entry like `launcher.YOUR_DOMAIN_NAME.com`, with your **IP** of the machine with the LauncherServer
::: details Путь к конфигурации Nginx:
Предпочтительно создавать отдельный файл конфигурации для каждого домена отдельно:
(Воспользуйтесь SFTP клиентом)
```
/etc/nginx/conf.d/launcher.ВАШ_ДОМЕН.conf
```
Если у вас на машине будет только одна настройка, можете отредактировать конфигурацию по умолчанию:
```bash:no-line-numbers
nano /etc/nginx/conf.d/default.conf
```
:::
:::: code-group
::: code-group-item [ На DNS имени ]
```nginx{10,12-13,15}:no-line-numbers
upstream gravitlauncher {
    server 127.0.0.1:9274;
}
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}
server {
    listen 80;
    server_name launcher.ВАШ_ДОМЕН;
    charset utf-8;
    #access_log  /var/log/nginx/launcher.ВАШ_ДОМЕН.access.log;
    #error_log  /var/log/nginx/launcher.ВАШ_ДОМЕН.error.log notice;
    
    root /путь/до/updates; # Example: /home/launcher/updates
    
    location / {
    }
    location /api {
        proxy_pass http://gravitlauncher;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location /webapi/ {
        proxy_pass http://127.0.0.1:9274/webapi/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```
:::
::: code-group-item [ На IP ]
```nginx{12-13,15}:no-line-numbers
upstream gravitlauncher {
    server 127.0.0.1:9274;
}
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}
server {
    listen 80;

    charset utf-8;
    #access_log  /var/log/nginx/launcher.access.log;
    #error_log  /var/log/nginx/launcher.error.log notice;
    
    root /путь/до/updates; # Example: /home/launcher/updates
    
    location / {
    }
    location /api {
        proxy_pass http://gravitlauncher;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location /webapi/ {
        proxy_pass http://127.0.0.1:9274/webapi/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```
:::
::: code-group-item [ Под Docker ]
::: tip Для главного nginx, не в контейнере
- Получить IPAddress контейнера. Где `<container id>` это UUID контейнера
```bash:no-line-numbers
docker inspect <container id> | grep "IPAddress"
```
- Заменить `127.0.0.1` адрес на локальный IP от вашего интерфейса для Docker, полученный выше
```nginx{2,10,12-13,15}:no-line-numbers
upstream gravitlauncher {
    server 127.0.0.1:9274;
}
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}
server {
    listen 80;
    server_name ВАШ_ПОДДОМЕН_ДЛЯ_ЛАУНЧЕРА;
    charset utf-8;
    #access_log  /var/log/nginx/launcher.ВАШ_ДОМЕН.access.log;
    #error_log  /var/log/nginx/launcher.ВАШ_ДОМЕН.error.log notice;
    
    root /путь/до/updates;
    
    location / {
    }
    location /api {
        proxy_pass http://gravitlauncher;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location /webapi/ {
        proxy_pass http://127.0.0.1:9274/webapi/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```
:::
:::
::::

::::: tip Проверить конфигурацию и перезагрузить Nginx:

```bash:no-line-numbers
nginx -t
```
Должны увидеть:
```log
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```
Включить Nginx как службу Systemd:
```bash:no-line-numbers
systemctl enable nginx
```
Перезагрузка сервиса:
:::: code-group
::: code-group-item Systemd
```bash:no-line-numbers
systemctl restart nginx
```
:::
::: code-group-item init.d
```bash:no-line-numbers
service nginx restart
```
:::
::::
:::::

::: warning
 - Без доменного имени перенос Лаунчера на другую машину привёдёт к отказу самообновления.
 - Так же SSL сертификат невозможно выдать на IP. В последствии соединение будет незащищённым и может быть скомпрометировано.
:::
::: details Заметки по правам: <Badge type="warning" text="Важно" vertical="top" />
Если у nginx нет прав для чтения директорий, выдайте:
```bash:no-line-numbers
chmod +x /home/launcher &&
find /home/launcher/updates -type d -exec chmod 755 {} \; &&
find /home/launcher/updates -type f -exec chmod 644 {} \;
```
Изменить группу и пользователя на всё содержимое домашней директории **launcher**:
```bash:no-line-numbers
chown -R launcher:launcher /home/launcher
```
:::

### Настройка безопасного подключения

Для обеспечения безопасности передаваемых паролей, защиты от внедрения в процесс обмена данными нужно подключить к своему домену SSL сертификат. На данный момент его можно купить или получить бесплатно (Let's Encrypt/Cloudflare). Вы должны будете установить его на домен с ЛаунчСервером ```ВАШ_ПОДДОМЕН_ДЛЯ_ЛАУНЧЕРА``` это ```launcher.ИМЯ_ВАШЕГО_ДОМЕНА.ru``` и немного изменить настройки ЛаунчСервера:

-   Откройте файл LaunchServer.json и найдите там секцию netty
-   Измените ссылки формата:
    - ```http://ВАШ_ПОДДОМЕН_ДЛЯ_ЛАУНЧЕРА ИЛИ IP:9274/ЧТО-ТО```
    - на:
    - ```https://ВАШ_ПОДДОМЕН_ДЛЯ_ЛАУНЧЕРА/ЧТО-ТО```
-   Измените ссылку на websocket Лаунчера с:
    - ```ws://ДОМЕН ИЛИ IP:9274/api```
    - на:
    - ```wss://ВАШ_ПОДДОМЕН_ДЛЯ_ЛАУНЧЕРА/api```
-   Если создавали поддомен, должно быть указано в формате ```launcher.ВАШ_ДОМЕН```
-   Соберите Лаунчер командой ```build``` и проверьте работоспособность
-   Закройте порт 9274 (если он был открыт), так как теперь ЛаунчСервер будет получать и передавать данные через nginx по портам 80 и 443

В качестве дополнительных мер безопасности можно настроить сертификат подписи кода (CodeSign), который помогает уменьшить ложноположительные срабатывания антивирусов на Launch4J обертку (для .exe файла). Установите модуль  [OSSLCodeSignModule](https://github.com/GravitLauncher/LauncherModules/tree/master/OpenSSLSignCode_module)  для подписи. Получить сертификат подписи кода можно несколькими способами:

-   Сгенерировать самоподписанный сертификат с помощью модуля  [GenerateCertificateModule](https://github.com/GravitLauncher/LauncherModules/tree/master/GenerateCertificate_module)
-   Создать себе самоподписанные сертификаты с помощью утилиты  [XCA](https://github.com/chris2511/xca/releases)
-   Купить полноценный сертификат подписи кода (дорого)
-   Отдать сборки Лаунчера другому человеку, который подпишет .exe файлы за денежное вознаграждение

Для большинства проектов (кроме достаточно крупных) рекомендуется первый вариант. По ссылке вы можете найти инструкцию по установке модуля и генерации сертификата.

Если вы не крупный проект, то скорее всего столкнетесь с защитником  [SmartScreen](https://docs.microsoft.com/ru-ru/windows/security/threat-protection/microsoft-defender-smartscreen/microsoft-defender-smartscreen-overview), который ведет статистику скачиваний и на файлы с низким числом скачиваний выдает предупреждение. Чтобы его не было, вам необходимо отправить файл на проверку:

-   Зарегистрируйтесь или войдите в аккаунт Microsoft
-   Отправьте файл на проверку, заполнив  [эту форму](https://www.microsoft.com/en-us/wdsi/filesubmission/)
-   Ждите результата

При достижении определенного числа скачиваний проблема уйдет "сама собой", а некоторые пользователи могут её вовсе не заметить.

### Установка LauncherPrestarter
Начииная с версии 5.5 лаунчер требует Java 17+ для работы. Что бы избавить игроков от необходимости устанавливать Java самостоятельно был создан LauncherPrestarter. Перейдите на [страницу проекта на GitHub](https://github.com/GravitLauncher/LauncherPrestarter) что бы узнать больше

## Установка dev версий ЛаунчСервера

DEV версии ЛаунчСервера содержат самый новый функционал и исправления, которые ещё не попали в релиз. Они могут быть нестабильны( вызывать проблемы), иметь расхождение с официальной вики. Настоятельно рекомендуется проверять работоспособность dev версий в тестовом окружении, прежде чем давать игрокам.

-   **Первый способ: Установка скриптом.**  Следуйте  [этой](../install/#установка-launchserver-1)  инструкции, используя скрипт установки DEV версии: ```https://mirror.gravitlauncher.com/scripts/setup-dev.sh```
-   **Второй способ: Установка через GitHub Actions.**
    -   Зарегистрируйтесь или войдите на  [GitHub](https://github.com/)
    -   Скачайте архивы с  [Лаунчером](https://github.com/GravitLauncher/Launcher/actions?query=event%3Apush+branch%3Adev)  и  [рантаймом](https://github.com/GravitLauncher/LauncherRuntime/actions?query=event%3Apush+branch%3Adev)  с GitHub Actions.
    -   Действуйте аналогично установке  [stable версии](../install/#установка-на-windows-только-для-тестирования) на Windows, используя архивы, скачанные на предыдущем этапе

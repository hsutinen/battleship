#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlComponent>
#include <QObject>

#include "game.h"

int main(int argc, char *argv[])
{
#if QT_VERSION < QT_VERSION_CHECK(6, 0, 0)
    QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
#endif

    QGuiApplication app(argc, argv);

    QQmlApplicationEngine engine;
    const QUrl url(QStringLiteral("qrc:/main.qml"));

    QQmlComponent component(&engine, url);

    QObject *object = component.create();

    Game game(&engine);
    QObject *button = object->findChild<QObject *>("requestButton");
    if (object) {
        QObject::connect(button, SIGNAL(requestPressed(QString)),
                         &game, SLOT(joinGameRequest(QString)));
    }

    QObject *contentFrame = object->findChild<QObject *>("contentFrame");
    QQmlComponent newComponent(&engine, QUrl(QStringLiteral("qrc:/initialize-game.qml")));
    QObject *newObject = newComponent.create();
    QVariant arg = QVariant::fromValue(newObject);
    QMetaObject::invokeMethod(contentFrame, "replace", Q_ARG(QVariant, arg));

    return app.exec();
}

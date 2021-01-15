#include <QGuiApplication>
#include <QQmlApplicationEngine>
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

    engine.load(url);
    QObject * const object = engine.rootObjects().at(0);

    Game game(&engine);
    QObject *button = object->findChild<QObject *>("requestButton");
    if (object) {
        QObject::connect(button, SIGNAL(requestPressed(QString)),
                         &game, SLOT(joinGameRequest(QString)));
    }

    return app.exec();
}

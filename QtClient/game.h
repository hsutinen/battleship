#ifndef GAME_H
#define GAME_H

#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QUrl>
#include <QString>
#include <QObject>

class Game : public QObject
{
    Q_OBJECT
public:
    Game();
public slots:
    void joinGame(const QString &playerName);
    void requestFinished(QNetworkReply *reply);
private:
    QNetworkAccessManager *m_manager;
};

#endif // GAME_H

#ifndef GAME_H
#define GAME_H

#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QJsonDocument>
#include <QUrl>
#include <QString>
#include <QObject>

class Game : public QObject
{
    Q_OBJECT
public:
    Game();

    enum RequestStatus {
        JoinGameRequestPending,
        StatusRequestPending,
        NoRequest
    };

    enum GameStatus {
        WaitingForPlayer,
        GameInitializing,
        GameRunning,
        GameOver,
        GameError,
        NoGame
    };

    void getRequest(const QString &requestUrl);

public slots:
    void joinGameRequest(const QString &playerName);
    void statusRequest(const QString &gameId);
    void requestFinished(QNetworkReply *reply);
private:
    void joinGameHandler(QByteArray &data);
    void statusHandler(QByteArray &data);
    RequestStatus m_requestStatus;
    QNetworkAccessManager *m_manager;
    QString m_gameId;
    QString m_playerId;
    GameStatus m_gameStatus;
    QString m_errorMessage;
};

#endif // GAME_H

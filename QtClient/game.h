#ifndef GAME_H
#define GAME_H

#include <QQmlApplicationEngine>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QJsonDocument>
#include <QUrl>
#include <QString>
#include <QObject>
#include <QTimer>

class Game : public QObject
{
    Q_OBJECT
public:
    Game(QQmlApplicationEngine *engine);

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

public slots:
    void joinGameRequest(const QString &playerName);
    void requestFinished(QNetworkReply *reply);
    void updateStatus();

private:
    void statusRequest(const QString &gameId);
    void getRequest(const QString &requestUrl);
    void joinGameHandler(QByteArray &data);
    void statusHandler(QByteArray &data);
    RequestStatus m_requestStatus;
    QQmlApplicationEngine *m_engine;
    QNetworkAccessManager *m_manager;
    QTimer *m_timer;
    QString m_gameId;
    QString m_playerId;
    GameStatus m_gameStatus;
    QString m_errorMessage;
};

#endif // GAME_H

#include <QByteArray>
#include <QDebug>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>

#include "game.h"
#include "jsonutils.h"

Game::Game()
{
    m_manager = new QNetworkAccessManager();
    QObject::connect(m_manager, &QNetworkAccessManager::finished,
                     this, &Game::requestFinished);
    m_requestStatus = NoRequest;
    m_gameId = QStringLiteral("");
    m_playerId = QStringLiteral("");
    m_gameStatus = NoGame;
}

void Game::getRequest(const QString & requestUrl)
{
    QNetworkRequest req;
    QUrl url(requestUrl);
    req.setUrl(url);
    m_manager->get(req);
}

void Game::requestFinished(QNetworkReply *reply)
{
    QByteArray data = reply->readAll();
    qDebug() << data << Qt::endl;
    reply->deleteLater();
    switch(m_requestStatus) {
    case JoinGameRequestPending:
        m_requestStatus = NoRequest;
        joinGameHandler(data);
        if (m_gameId.compare(QStringLiteral("")) != 0)
            statusRequest(m_gameId);
        break;
    case StatusRequestPending:
        m_requestStatus = NoRequest;
        statusHandler(data);
        break;
    case NoRequest:
        assert(false); // Should never happen!
    }
    // Update game status from server
}

void Game::joinGameRequest(const QString &playerName) {
    // Handle requests one at a time
    if (m_requestStatus != NoRequest) return;

    // Join game is possible only when there is no game running.
    if (!(m_gameStatus == NoGame)) return;

    m_requestStatus = JoinGameRequestPending;
    getRequest(QStringLiteral("http://localhost:3000/join-game/") + playerName);
}

void Game::joinGameHandler(QByteArray &data) {
    QJsonDocument doc = QJsonDocument::fromJson(data);
    if (doc.isObject()) {
        QJsonObject o = doc.object();
        if (o.contains(QStringLiteral("error")))
            return;
        if (!JsonUtils::tryGetStringProperty(o, QStringLiteral("player_id"), m_playerId))
            qDebug() << "joinGameHandler(): Invalid response from server 1." << Qt::endl;
        if (!JsonUtils::tryGetStringProperty(o, QStringLiteral("game_id"), m_gameId))
            qDebug() << "joinGameHandler(): Invalid response from server 2." << Qt::endl;
        qDebug() << "m_gameId: " << m_gameId << Qt::endl;
        qDebug() << "m_playerId: " << m_playerId << Qt::endl;
    } else {
        qDebug() << "joinGameHandler(): Invalid response from server 3." << Qt::endl;
    }
}

void Game::statusRequest(const QString &gameId) {
    // Handle requests one at a time
    if (m_requestStatus != NoRequest) return;
    m_requestStatus = StatusRequestPending;
    getRequest(QStringLiteral("http://localhost:3000/status/") + gameId);
}

void Game::statusHandler(QByteArray &data) {
    QString status;
    QJsonDocument doc = QJsonDocument::fromJson(data);
    if (doc.isObject()) {
        QJsonObject o = doc.object();
        if (o.contains(QStringLiteral("error"))) {
            m_gameStatus = GameError;
            m_errorMessage = o["error"].toString();
            return;
        }
        if (JsonUtils::tryGetStringProperty(o, QStringLiteral("status"), status)) {
            if (status.compare("WAITING_FOR_PLAYER") == 0) {
                m_gameStatus = WaitingForPlayer;
            } else if (status.compare("GAME_INITIALIZING") == 0) {
                m_gameStatus = GameInitializing;
            } else if (status.compare("GAME_RUNNING") == 0) {
                m_gameStatus = GameRunning;
            } else if (status.compare("GAME_OVER") == 0) {
                m_gameStatus = GameOver;
            } else {
                // Should never happen!
                m_gameStatus = GameError;
                m_errorMessage = QStringLiteral("statusHandler(): Unknown game status from server.");
            }
        } else {
            m_gameStatus = GameError;
            m_errorMessage = QStringLiteral("statusHandler(): Could not get status from server.");
        }
    } else {
        m_gameStatus = GameError;
        m_errorMessage = QStringLiteral("statusHandler(): Server response is not Json object");
    }
}





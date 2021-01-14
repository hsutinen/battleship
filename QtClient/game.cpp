#include "game.h"
#include <QByteArray>
#include <QDebug>

Game::Game()
{
    m_manager = new QNetworkAccessManager();
    QObject::connect(m_manager, &QNetworkAccessManager::finished,
                     this, &Game::requestFinished);
}

void Game::requestFinished(QNetworkReply *reply)
{
    QByteArray data = reply->readAll();
    qDebug() << data << Qt::endl;
    reply->deleteLater();
}

void Game::joinGame(const QString &playerName) {
    QNetworkRequest req;
    QUrl url("http://localhost:3000/join-game/" + playerName);
    req.setUrl(url);
    m_manager->get(req);
}

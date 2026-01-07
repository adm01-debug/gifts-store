                              <Badge variant="outline" className="text-green-600">
                                <Check className="h-3 w-3 mr-1" />
                                Adquirido
                              </Badge>
                            ) : isOutOfStock ? (
                              <Badge variant="secondary">Esgotado</Badge>
                            ) : (
                              <Badge
                                variant={canAfford ? "default" : "secondary"}
                                className="flex items-center gap-1"
                              >
                                <Coins className="h-3 w-3" />
                                {reward.coin_cost}
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedReward} onOpenChange={() => setSelectedReward(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedReward?.icon || "🎁"}</span>
              {selectedReward?.name}
            </DialogTitle>
            <DialogDescription>{selectedReward?.description}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span>Custo</span>
              <Badge className="flex items-center gap-1 text-lg px-3 py-1">
                <Coins className="h-4 w-4" />
                {selectedReward?.coin_cost}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4">
              <span>Seu saldo</span>
              <span className="font-bold">{userCoins.toLocaleString()} moedas</span>
            </div>
            {selectedReward && userCoins < selectedReward.coin_cost && (
              <p className="text-sm text-destructive text-center">
                Você não tem moedas suficientes
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReward(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={
                !selectedReward ||
                userCoins < selectedReward.coin_cost ||
                purchaseReward.isPending
              }
            >
              {purchaseReward.isPending ? "Resgatando..." : "Resgatar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

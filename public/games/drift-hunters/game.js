var gameInstance;

gameInstance = UnityLoader.instantiate("gameContainer", "/build/itchio.json", {
  onProgress: UnityProgress,
  Module: {
    onRuntimeInitialized: function () {
      UnityProgress(gameInstance, "complete");
    },
  },
});

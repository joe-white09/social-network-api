const { User, Thought } = require('../models');

const ThoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        })
    },

    getThoughtById({ params }, res){
        Thought.findOne({ _id: params.id })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        })
    },

    addThought({  body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { username: body.username },
                    { $addToSet: {thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: {reactions: req.body } },
            { new: true }  
            )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    return res.status(404).json({ message: 'No Thought found with this id' });
                }
                res.json(dbThoughtData);
            })
            .catch(err =>{ 
                console.log(err);
                res.status(500).json(err);
            });
    },

    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: {reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err));
    },

    updateThought({params, body}, res) {
        Thought.findOneAndUpdate(
            { _id: params.id}, 
            body, 
            { new: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(400).json({ message: 'No thought with that id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought with this id' })
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    }
};

module.exports = ThoughtController;
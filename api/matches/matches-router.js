const router = require("express").Router();
const Match = require("./matches-model.js");
const restrict = require("../authenticate-middleware.js");

// GET list of ALL SAVED matched entries
router.get("/", restrict, (req, res) => {
	Match.find()
		.then(matches => {
			res.json(matches);
		})
		.catch(err => res.send(err));
});

// GET list of ALL SAVED matched entries by id
//need to fix
router.get("/favejobs/:id", restrict, async (req, res) => {
	const id = req.params.id;
	const saved = await Match.faveOfSeeker(id);
	if (!saved) {
		res.status(200).json(saved);
	} else {
		console.log("error in attempt to get saved matches");
		res
			.status(500)
			.json({ error: "Error cannot retrieve saved matches with this user id" });
	}
});

//GET find jobs that matches seeker with specified id
router.get("/matchseeker/:id", restrict, async (req, res) => {
	const id = req.params.id;
	const matches = await Match.findJobs(id);
	if (matches) {
		res.status(200).json(matches);
	} else {
		console.log("error in GET api/matches/:id");
		res
			.status(500)
			.json({ error: "Could not find any jobs that match you today." });
	}
});

//companies looking for matched seekers(find seekers)
router.get("/matchjob/:id", restrict, async (req, res) => {
	const id = req.params.id;
	const matches = await Match.findSeeker(id);
	if (matches) {
		res.status(200).json(matches);
	} else {
		console.log("error in GET api/matches/:id");
		res
			.status(500)
			.json({ error: "Could not find any job seekers to match that job" });
	}
});

//SAVE matches to favorites
router.post("/", restrict, (req, res) => {
	const match = req.body;
	Match.add(match)
		.then(match => {
			res.status(201).json(match);
		})
		.catch(err => {
			console.log(err);
		});
});

// REMOVE a saved match
router.delete("/:id", (req, res) => {
	const { id } = req.params;

	Match.remove(id)
		.then(deleted => {
			if (deleted) {
				res.json({ removed: deleted });
			} else {
				res
					.status(404)
					.json({ message: "Could not find a saved match with given id" });
			}
		})
		.catch(err => {
			res.status(500).json({ message: "Failed to delete recipe" });
		});
});

module.exports = router;

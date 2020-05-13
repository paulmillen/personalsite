from verbtabledata import verb_dictionary, available_tenses


def get_verb_table(verbs=["être", "avoir"]):
    if "*" in verbs:
        return verb_dictionary
    else:
        return dict((verb, verb_dictionary[verb]) for verb in verbs if verb in verb_dictionary)


def get_available_verbs():
    return list(verb_dictionary.keys())


def get_verbtable_response(verbs):
    return {
        "verbs": get_verb_table(verbs),
        "availableTenses": available_tenses,
        "availableVerbs": get_available_verbs(),
    }

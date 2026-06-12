<?php

namespace App\Models;

use Database\Factories\PresentationSlideFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PresentationSlide extends Model
{
    /** @use HasFactory<PresentationSlideFactory> */
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'design_id',
        'name',
        'comment',
        'sort_order',
    ];

    /**
     * Get the design this slide presents.
     *
     * @return BelongsTo<Design, $this>
     */
    public function design(): BelongsTo
    {
        return $this->belongsTo(Design::class);
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('presentation_slides', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('design_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->text('comment')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presentation_slides');
    }
};
